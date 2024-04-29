import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "../components/NotFound";
import { baseUrl } from "../shared";

export default function Customer() {
    const [customer, setCustomer] = useState();
    const [notFound, setNotFound] = useState();

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const url = baseUrl + 'api/customers/' + id
        fetch(url)
            .then(response => {
                if (response.status === 404) {
                    // redirect to a 404 page (new URL) : 1 --- easier method
                    // navigate('/404');

                    // render a 404 component in this page : 2 --- other method
                    setNotFound(true)
                }
                return response.json()
            })
            .then(data => setCustomer(data.customer))
            .catch((e) => console.log('Network Error'));
    }, []);

    return (
        <>
            {notFound ? <NotFound message={`The customer with id ${id} was not found`} /> : null}
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