import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Customer() {
    const [customer, setCustomer] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const url = 'http://localhost:8000/api/customers/' + id
        fetch(url)
            .then(response => response.json())
            .then(data => setCustomer(data.customer))
            .catch((e) => console.log('Network Error'));
    }, []);

    return (
        <>
            {customer ? (
                <div>
                    <p>ID: {customer.id}</p>
                    <p>Name: {customer.name}</p>
                    <p>Industry: {customer.industry}</p>
                </div>) : null
            }
            <Link to="/customers">Go back</Link>
        </>
    );
}