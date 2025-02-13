import { FormEvent, useState, useTransition } from "react";

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

  const [formState, setFormState] = useState(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
      data: null,
    }
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      const result = await action(data);

      if (result.success && onSuccess) {
        if (result.data !== null) {
          await onSuccess(result.data);
        } else {
          await onSuccess();
        }
      }

      setFormState(result);
    });
  }

  return [formState, handleSubmit, isPending] as const;
}
