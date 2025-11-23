const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Initialize the generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

/**
 * @route   POST /api/ai/chat
 * @desc    Handle an advanced, data-aware message from the AI chatbot
 * @access  Private
 */
router.post('/chat', protect, async (req, res) => {
    const { message, history, userRole, currentPage } = req.body;
    const user = req.user; // We have the logged-in user thanks to 'protect'

    try {
        let context = "";
        const lowerMessage = message.toLowerCase();
        let intent = 'GENERAL_CHAT';

        // --- 1. INTENT & ENTITY RECOGNITION ---
        const orderIdRegex = /([a-f\d]{24})/i;
        const orderIdMatch = message.match(orderIdRegex);
        let specificOrderId = orderIdMatch ? orderIdMatch[1] : null;

        if (specificOrderId) {
            intent = 'SPECIFIC_ORDER_STATUS';
        } else if (lowerMessage.includes('order') || lowerMessage.includes('tracking') || lowerMessage.includes('delivery')) {
            intent = 'GENERAL_ORDER_STATUS';
        } else if (lowerMessage.includes('product') || lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('recommend')) {
            intent = 'PRODUCT_INFO';
        } else if (lowerMessage.includes('points') || lowerMessage.includes('loyalty')) {
            intent = 'LOYALTY_POINTS';
        } else if (userRole === 'retailer' && (lowerMessage.includes('sell') || lowerMessage.includes('inventory') || lowerMessage.includes('dashboard'))) {
            intent = 'RETAILER_HELP';
        }

        // --- 2. DATA RETRIEVAL (The "R" in RAG) ---
        switch (intent) {
            case 'SPECIFIC_ORDER_STATUS':
                try {
                    const specificOrder = await Order.findById(specificOrderId);
                    if (specificOrder && specificOrder.user.toString() === user.id) {
                        context = `Here is the specific order the user asked about (ID: ${specificOrderId}): ${JSON.stringify(specificOrder)}`;
                    } else {
                        context = `The user asked for Order ID ${specificOrderId}, but this order was not found or does not belong to them.`;
                    }
                } catch (e) {
                    context = `The user provided an invalid Order ID: ${specificOrderId}. Tell them it seems to be an invalid order number.`;
                }
                break;

            case 'GENERAL_ORDER_STATUS':
                const orders = await Order.find({ user: user.id }).sort({ createdAt: -1 }).limit(3);
                context = orders.length > 0
                    ? `The user asked a general question about orders. Here are their 3 most recent orders: ${JSON.stringify(orders)}`
                    : "The user has no orders in their history.";
                break;

            case 'PRODUCT_INFO':
                const products = await Product.find({ $text: { $search: lowerMessage } }).limit(3);
                context = products.length > 0
                    ? `Here are some products matching the user's query: ${JSON.stringify(products)}`
                    : "No products found matching that description.";
                break;

            case 'LOYALTY_POINTS':
                context = `The user's current loyalty point balance is: ${user.loyaltyPoints}`;
                break;

            case 'RETAILER_HELP':
                context = `The user is a Retailer. They are currently on the page: ${currentPage}. Provide helpful advice for managing their store, inventory, or orders on Live MART.`;
                break;

            default:
                context = `User Role: ${userRole}. Current Page: ${currentPage}. User is making general conversation. Be helpful and friendly.`;
                break;
        }

        // --- 3. PROMPT AUGMENTATION (The "A" in RAG) ---
        let cleanedHistory = history || [];
        if (cleanedHistory.length > 0 && cleanedHistory[0].role === 'model') {
            cleanedHistory = cleanedHistory.slice(1);
        }

        // Create the full prompt for the AI
        const prompt = `
            You are "Marty," an AI shopping assistant for Live MART.
            Your tone is helpful, friendly, and slightly futuristic.
            
            **User Info:**
            - Role: ${userRole}
            - Current Page: ${currentPage}

            **Your Primary Goal:**
            Answer the user's question: "${message}"

            **Your Context:**
            You MUST base your entire answer *only* on the "CONTEXT" block provided below. Do not make up information.
            ---
            CONTEXT: ${context}
            ---

            **Response Rules (Very Important):**
            1.  **No Markdown:** You MUST NOT use any Markdown formatting. Do not use asterisks (**) for bolding or hyphens (-) for lists.
            2.  **Be Conversational:** Write your answer as a single, natural paragraph. Weave the details into a friendly sentence.
            3.  **Role Awareness:** 
                - If the user is a Retailer, speak to them as a business partner.
                - If the user is a Customer, speak to them as a shopper.
            4.  **How to Answer:**
                - If the context has products: "I found a couple of great options for [product]..."
                - If the context has an order: "I've looked up that order for you. It looks like order #[Order ID] is currently [Status]..."
                - If the context has no info: "I'm sorry, I couldn't find any [products/orders] matching that. Could you try being more specific?"
        `.trim().replace(/\s+/g, ' ');

        let finalHistory = cleanedHistory;
        if (finalHistory.length === 0) {
            finalHistory.push({ role: 'user', parts: [{ text: prompt }] });
            finalHistory.push({ role: 'model', parts: [{ text: "Understood. I am Marty, your AI assistant. How can I help?" }] });
        }

        const chat = model.startChat({
            history: finalHistory,
        });
        // --- 4. GENERATION (The "G" in RAG) ---
        const result = await chat.sendMessage(prompt + "\n\nUSER QUESTION: " + message);
        const response = result.response;

        res.json({ reply: response.text() });

    } catch (err) {
        console.error("AI Chat Error:", err);

        // SPECIFIC HANDLER FOR QUOTA ERRORS (429)
        if (err.message.includes("429") || err.status === 429) {
            return res.status(429).json({
                response: "I'm a bit overwhelmed right now! My daily limit is reached. Please try again in a few minutes or check back tomorrow."
            });
        }

        // GENERIC ERROR HANDLER
        res.status(500).json({
            response: "Sorry, I encountered an error processing your request."
        });
    }
});

module.exports = router;