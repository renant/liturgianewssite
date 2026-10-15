import { FormEvent, useEffect, useRef, useState, useTransition } from "react";

type ValidationError = Record<string, string[]>;

export type ActionResult<T = null> = {
  success: boolean;
  message: string | null;
  errors: ValidationError | null;
  data?: T | null;
};

export function useFormState<T = null>(
  action: (data: FormData) => Promise<ActionResult<T>>,
  onSuccess?: (data?: T) => Promise<void> | void,
  initialState?: ActionResult<T>
) {
  const [isPending, startTransition] = useTransition();
  const submittedForm = useRef<HTMLFormElement | null>(null);

  const [formState, setFormState] = useState(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
      data: null,
    }
  );

  useEffect(() => {
    const firstError = Object.keys(formState.errors ?? {})[0];
    const field = firstError && submittedForm.current?.elements.namedItem(firstError);
    if (field instanceof HTMLElement) field.focus();
  }, [formState]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    if (isPending) return;
    submittedForm.current = form;
    const errors: ValidationError = {};
    for (const field of Array.from(form.elements)) {
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) || !field.name || field.validity.valid) continue;
      errors[field.name] = [field.validity.valueMissing ? "Preencha este campo." : field instanceof HTMLInputElement && field.type === "email" ? "Informe um endereço de e-mail válido." : "Verifique o valor deste campo."];
    }
    if (Object.keys(errors).length > 0) {
      setFormState({ success: false, message: "Confira os campos indicados.", errors, data: null });
      return;
    }
    const data = new FormData(form);

    startTransition(async () => {
      try {
        const result = await action(data);
        setFormState(result);
        if (result.success && onSuccess) {
          await onSuccess(result.data ?? undefined);
        }
      } catch {
        setFormState({ success: false, message: "Não foi possível concluir o envio. Verifique sua conexão e tente novamente.", errors: null, data: null });
      }
    });
  }

  return [formState, handleSubmit, isPending] as const;
}
