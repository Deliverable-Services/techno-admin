import API from "../../utils/API";

import './invoice.css';
const StripeContent = () => {
    const handleCreate = async () => {
        try {
            const response = await API.get('/stripe/connect');
            if (response?.data?.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    return (
        <div>
            <button className="primary-btn handleButton" onClick={handleCreate}>  Contact to Stripe</button>
        </div>
    )
}

export default StripeContent;