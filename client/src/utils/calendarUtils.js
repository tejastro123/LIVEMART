export const generateGoogleCalendarLink = (order, role = 'Customer') => {
  // Calculate delivery date (Creation + 2 days)
  const deliveryDate = new Date(order.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 2);

  // Set start time to 9:00 AM on delivery day
  const startDate = new Date(deliveryDate);
  startDate.setHours(9, 0, 0, 0);

  // Set end time to 10:00 AM
  const endDate = new Date(startDate);
  endDate.setHours(10, 0, 0, 0);

  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const startStr = formatDate(startDate);
  const endStr = formatDate(endDate);

  const title = encodeURIComponent(`Order #${order._id} - ${role === 'Retailer' ? 'Fulfillment' : 'Delivery'} Reminder`);

  const itemsList = order.items.map(item => `- ${item.name} (x${item.quantity})`).join('\\n');
  // Safely format total amount, handling undefined or null values
  const totalAmountStr = order.totalAmount != null ? order.totalAmount.toFixed(2) : "N/A";
  const description = encodeURIComponent(
    `Order Details:\\n${itemsList}\\n\\nTotal Amount: $${totalAmountStr}\\n\\nStatus: ${order.status}`
  );

  const location = encodeURIComponent(
    `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
  );

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${description}&location=${location}`;
};
