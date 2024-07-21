export const SMS_TEMPLATE_CUSTOMER = {
    // PENDING: "PENDING",
    READY_TO_DELIVER: `Hey!, your order {{orderNumber}} of Rs. {{totalSellingPrice}} from {{storeName}} is on the way. Please pick the call from our delivery partner. Team SHOPOLITE.`,
    DELIVERED: "Hurray!, Your order {{orderNumber}} of Rs. {{totalSellingPrice}} has been delivered. Thank you for ordering from {{storeName}} on SHOPOLITE. we hope to see you soon.",
    // RETURN: "RETURN",
    ACCEPT: "Hurray!, your order {{orderNumber}} of Rs. {{totalSellingPrice}} has been accepted by {{storeName}} and will be dispatched shortly. Thanks for ordering on SHOPOLITE.",
    REJECT: "Sorry, your order {{orderNumber}} of Rs. {{totalSellingPrice}} has been rejected by {{storeName}}. Please login to your SHOPOLITE account for more details."
}

export const SMS_TEMPLATE_STORE = {
    PENDING: "Hey!, you have received an order amounting to Rs. {{totalSellingPrice}}. The order number is {{orderNumber}}. Please check your SHOPOLITE app for more details.",
    // READY_TO_DELIVER: "READY_TO_DELIVER",
    // DELIVERED: "DELIVERED",
    // RETURN: "RETURN",
    // ACCEPT: "ACCEPT",
    // REJECT: "REJECT"
}