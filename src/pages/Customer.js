import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "../components/NotFound";
import { baseUrl, wait } from "../shared";

export default function Customer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState();
    const [tempCustomer, setTempCustomer] = useState();
    const [notFound, setNotFound] = useState();
    const [changed, setChanged] = useState(false);
    const [error, setError] = useState();


    useEffect(() => {
        console.log(customer)
        if (!customer) return;
        if (!tempCustomer) return;

        let equal = true;
        if (customer.name !== tempCustomer.name) equal = false;
        if (customer.industry !== tempCustomer.industry) equal = false;

        if (equal) setChanged(false);
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
                if (response.status === 401) navigate('/login')

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

    function updateCustomer(e) {
        e.preventDefault()

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
        <div className="p-3">
            {notFound ? <NotFound message={`The customer with id ${id} was not found`} /> : null}

            {customer ? (
                <div>
                    <p className="block">ID: {tempCustomer.id}</p>

                    <form
                        className="w-full max-w-sm"
                        id="customer"
                        onSubmit={updateCustomer}>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/4">
                                <label htmlFor="name">Name</label>
                            </div>
                            <div className="md:w-3/4">
                                <input
                                    id="name"
                                    className="m-2 block px-2 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 text-gray-700 leading-tight"
                                    type="text"
                                    value={tempCustomer.name}
                                    onChange={(e) => {
                                        setChanged(true)
                                        setTempCustomer({ ...tempCustomer, name: e.target.value })
                                    }} />
                            </div>
                        </div>

                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/4">
                                <label htmlFor="industry">Industry</label>
                            </div>

                            <div className="md:w-3/4">
                                <input
                                    id="industry"
                                    className="m-2 block px-2 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 text-gray-700 leading-tight"
                                    type="text"
                                    value={tempCustomer.industry}
                                    onChange={(e) => {
                                        setChanged(true)
                                        setTempCustomer({ ...tempCustomer, industry: e.target.value })
                                    }} />
                            </div>
                        </div>
                    </form>

                    {changed ?
                        <div className="mb-2">
                            <button
                                className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 mr-2 rounded"
                                onClick={() => {
                                    setTempCustomer({ ...customer })
                                    setChanged(false)

                                }}>
                                Cancel
                            </button>

                            <button
                                form="customer"
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                                Save
                            </button>
                        </div> : null}

                    <div>
                        <button
                            className="bg-slate-800 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                            onClick={deleteCustomer}>
                            Delete
                        </button>
                    </div>

                    {error ? <p>{error}</p> : null}
                </div>
            ) : null}

            <br />
            <Link to="/customers">
                <button className="no-underline bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    &larr; Go back
                </button>
            </Link>
        </div>
    );
}