import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "../components/NotFound";
import { baseUrl } from "../shared";

export default function Customer() {
    const [customer, setCustomer] = useState();
    const [tempCustomer, setTempCustomer] = useState();
    const [notFound, setNotFound] = useState();
    const [changed, setChanged] = useState(false);
    const [error, setError] = useState();


    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!customer) return;
        if (!tempCustomer) return;

        let equal = true;
        if (customer.name !== tempCustomer.name) equal = false; 
        if (customer.industry !== tempCustomer.industry) equal = false; 
        if (equal) setChanged(false);


        // setChanged(() => {
        //     if (JSON.stringify(customer) === JSON.stringify(tempCustomer)) {
        //         return false
        //     }
        //     return true
        // })
    })

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
            .then((data) => {
                setCustomer(data.customer);
                setTempCustomer(data.customer);
            })
            .catch((e) => console.log('Network Error'));
    }, []);

    function deleteCustomer() {
        const url = baseUrl + 'api/customers/' + id;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        },)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Something went wrong')
                }
                
                setError(undefined) // not really needed since we navigating
                navigate('/customers')
            })
            .catch((e) => {
                console.log(e);
                setError(e.message)
            })
    }

    function updateCustomer() {
        const url = baseUrl + 'api/customers/' + id;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tempCustomer)
        },).then((response) => {
            if (!response.ok) {
                throw new Error('something went wrong');
            }
            return response.json();
        }).then((data) => {
            setChanged(false)
            setCustomer(data)
            setError(undefined);

        }).catch((e) => {
            console.log(e);
            setError(e.message);
        })
    }

    return (
        <>
            {notFound ? <NotFound message={`The customer with id ${id} was not found`} /> : null}
            {customer ? (
                <div>
                    <p className="m-2 block px-2">ID: {tempCustomer.id}</p>

                    <input
                        className="m-2 block px-2"
                        type="text"
                        value={tempCustomer.name}
                        onChange={(e) => {
                            setChanged(true)
                            setTempCustomer({ ...tempCustomer, name: e.target.value })
                        }} />

                    <input
                        className="m-2 block px-2"
                        type="text"
                        value={tempCustomer.industry}
                        onChange={(e) => {
                            setChanged(true)
                            setTempCustomer({ ...tempCustomer, industry: e.target.value })
                        }} />

                    {changed ? <>
                        <button
                            className="m-2"
                            onClick={() => {
                                setTempCustomer({ ...customer })
                                setChanged(false)

                            }}>Cancel</button>
                        <button
                            className="m-2"
                            onClick={updateCustomer}>Save</button>
                    </> : null}
                    <button onClick={deleteCustomer}>Delete</button>
                    {error ? <p>{error}</p> : null}
                </div>
            ) : null}

            <br />
            <Link to="/customers">Go back</Link>
        </>
    );
}