import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type ResponseData = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método não permitido" });
  }

  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ success: false, message: "Preencha todos os campos" });
  }

  try {
    // Configurar transporte SMTP usando Google Workspace
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Conteúdo do email
    const mailOptions = {
      from: process.env.SMTP_USER, // deve ser o mesmo que gerou a App Password
      to: process.env.CONTACT_EMAIL,
      subject: `Nova mensagem do site de ${nome}`,
      text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`,
      html: `<p><strong>Nome:</strong> ${nome}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mensagem:</strong><br/>${mensagem}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (err: unknown) {
    console.error("Erro ao enviar email:", err);
    return res.status(500).json({ success: false, message: "Erro ao enviar email" });
  }
}



