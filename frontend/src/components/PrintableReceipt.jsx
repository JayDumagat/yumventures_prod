import { forwardRef } from 'react';

const PrintableReceipt = forwardRef(({ order, response }, ref) => {
    console.log('Receipt Order:', order); // Log the order details
    console.log('Receipt Response:', response); // Log the response details

    return (
        <div ref={ref}>
            <h3>Order Receipt</h3>
            {/* Order ID and other details from the response */}
            <p><strong>Order ID:</strong> {response.order.id}</p>
            <p><strong>Total:</strong> ₱{response.order.total}</p>
            <p><strong>Tendered Amount:</strong> ₱{response.order.tenderedAmount}</p>
            <p><strong>Change:</strong> ₱{response.order.change}</p>

            {/* Ordered Items */}
            <h4>Ordered Items:</h4>
            <ul>
                {order.orderedItems.map((item, index) => (
                    <li key={index}>
                        {item.name} - {item.quantity} x ₱{item.price} = ₱{item.subtotal}
                    </li>
                ))}
            </ul>

            {/* Order Summary */}
            <h4>Summary:</h4>
            <p><strong>Total: </strong>₱{response.order.total}</p>
            <p><strong>Tendered Amount: </strong>₱{response.order.tenderedAmount}</p>
            <p><strong>Change: </strong>₱{response.order.change}</p>
        </div>
    );
});

export default PrintableReceipt;
