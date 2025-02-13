import * as React from "react";

const EmailConfirmation: React.FC<{ confirmationLink: string }> = ({
  confirmationLink,
}) => (
  <table
    cellPadding="0"
    cellSpacing="0"
    width="100%"
    style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
    }}
  >
    <tr>
      <td
        align="center"
        style={{ padding: "40px 0", backgroundColor: "#FFF7ED" }}
      >
        <table cellPadding="0" cellSpacing="0" width="80%">
          <tr>
            <td align="center">
              <h1
                style={{
                  color: "#78350F",
                  fontSize: "24px",
                  margin: "0 0 20px 0",
                }}
              >
                Confirme sua Inscrição
              </h1>
              <p
                style={{
                  color: "#78350F",
                  fontSize: "16px",
                  lineHeight: "1.5",
                  margin: "0 0 30px 0",
                }}
              >
                Obrigado por se inscrever na Newsletter da Liturgia Católica
                Diária. Para começar a receber nossas mensagens diárias, por
                favor, confirme seu e-mail clicando no botão abaixo.
              </p>
              <a
                href={confirmationLink}
                style={{
                  backgroundColor: "#92400E",
                  color: "#ffffff",
                  padding: "12px 30px",
                  textDecoration: "none",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  display: "inline-block",
                  fontSize: "16px",
                }}
              >
                Confirmar E-mail
              </a>
              <p
                style={{
                  color: "#78350F",
                  fontSize: "14px",
                  marginTop: "30px",
                }}
              >
                Se o botão acima não funcionar, copie e cole o seguinte link em
                seu navegador:
              </p>
              <p
                style={{
                  color: "#92400E",
                  fontSize: "14px",
                  wordBreak: "break-all",
                }}
              >
                {confirmationLink}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td
        align="center"
        style={{
          padding: "20px",
          backgroundColor: "#FFFBEB",
          color: "#78350F",
          fontSize: "14px",
        }}
      >
        <p>
          Se você não se inscreveu para esta newsletter, por favor ignore este
          e-mail.
        </p>
        <p>
          &copy; 2025 Newsletter da Liturgia Católica Diária. Todos os direitos
          reservados.
        </p>
      </td>
    </tr>
  </table>
);

export default EmailConfirmation;
