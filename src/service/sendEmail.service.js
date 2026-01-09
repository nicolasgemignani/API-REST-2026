import { createTransport } from 'nodemailer';
import { variables } from '../config/var.entorno.js';

const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: variables.GMAIL_USER,
        pass: variables.GMAIL_PASS
    }
});

/**
 * Sends a purchase confirmation email to the user.
 * @param {string} email - Recipient's email address.
 * @param {Object} ticket - The generated ticket object.
 * @param {Array<Object>} notPurchasedProducts - Products not bought due to lack of stock.
 * @param {Array<Object>} purchasedProducts - Products successfully bought.
 */
export const sendPurchaseEmail = async (email, ticket, notPurchasedProducts, purchasedProducts) => {
    
    const purchasedProductsHtml = purchasedProducts.map(item => 
        `<li>
            <strong>Product:</strong> ${item.nombre} - 
            <strong>Quantity:</strong> ${item.cantidad} - 
            <strong>Unit Price:</strong> $${item.precio}
        </li>`
    ).join('');

    const notPurchasedProductsHtml = (notPurchasedProducts || []).map(item => 
        `<li>
            <strong>Product:</strong> ${item.nombre} - 
            <strong>Missing Quantity:</strong> ${item.cantidadFaltante}
        </li>`
    ).join('');

    await transport.sendMail({
        from: `Coder test <${variables.GMAIL_USER}>`,
        to: email,
        subject: 'Purchase Ticket',
        html: `
            <div>
                <h1>Purchase Ticket</h1>
                <p><strong>Ticket Code:</strong> ${ticket.code}</p>
                <p><strong>Purchaser:</strong> ${ticket.purchaser}</p>
                <p><strong>Total:</strong> $${ticket.amount}</p>

                <h2>Purchased Products:</h2>
                <ul>${purchasedProductsHtml}</ul>

                ${notPurchasedProducts.length ? `
                    <h2>Not Purchased Products (insufficient stock):</h2>
                    <ul>${notPurchasedProductsHtml}</ul>
                ` : ''}

                <p>Thank you for your purchase.</p>
            </div>
        `
    });
};