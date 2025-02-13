import type React from "react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactFormEmailTemplate: React.FC<ContactFormData> = ({
  name,
  email,
  subject,
  message,
}) => {
  return (
    <div>
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
        <tbody>
          <tr>
            <td
              align="center"
              style={{ padding: "40px 0", backgroundColor: "#FFF7ED" }}
            >
              <table cellPadding="0" cellSpacing="0" width="80%">
                <tbody>
                  <tr>
                    <td align="center">
                      <h1
                        style={{
                          color: "#78350F",
                          fontSize: "24px",
                          margin: "0 0 20px 0",
                        }}
                      >
                        Nova Mensagem de Contato
                      </h1>
                      <p
                        style={{
                          color: "#78350F",
                          fontSize: "16px",
                          lineHeight: "1.5",
                          margin: "0 0 30px 0",
                        }}
                      >
                        Você recebeu uma nova mensagem através do formulário de
                        contato do site da Newsletter da Liturgia Católica
                        Diária.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "40px 30px", backgroundColor: "#ffffff" }}>
              <table cellPadding="0" cellSpacing="0" width="100%">
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "10px 0",
                        borderBottom: "1px solid #E5E7EB",
                      }}
                    >
                      <strong style={{ color: "#1F2937" }}>Nome:</strong>{" "}
                      <span style={{ color: "#4B5563" }}>{name}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "10px 0",
                        borderBottom: "1px solid #E5E7EB",
                      }}
                    >
                      <strong style={{ color: "#1F2937" }}>E-mail:</strong>{" "}
                      <span style={{ color: "#4B5563" }}>{email}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "10px 0",
                        borderBottom: "1px solid #E5E7EB",
                      }}
                    >
                      <strong style={{ color: "#1F2937" }}>Assunto:</strong>{" "}
                      <span style={{ color: "#4B5563" }}>{subject}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px 0" }}>
                      <strong style={{ color: "#1F2937" }}>Mensagem:</strong>
                      <p
                        style={{
                          color: "#4B5563",
                          lineHeight: "1.5",
                          marginTop: "10px",
                        }}
                      >
                        {message}
                      </p>
                    </td>
                  </tr>
                </tbody>
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
                &copy; 2025 Newsletter da Liturgia Católica Diária. Todos os
                direitos reservados.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ContactFormEmailTemplate;
