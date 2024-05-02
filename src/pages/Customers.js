import { useState, useEffect } from "react"
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { baseUrl } from "../shared";
import AddCustomer from "../components/AddCustomer";

export default function Customers() {
    const [customers, setCustomers] = useState()
    const [show, setShow] = useState();

    function toggleShow() {
        setShow(!show)
    }

    useEffect(() => {
        const url = baseUrl + 'api/customers/'
        fetch(url)
            .then((response) => { return response.json() })
            .then((data) => {
                // console.log(data); 
                setCustomers(data.customers)
            })
    }, [])

    function newCustomer(name, industry) {
        const url = baseUrl + 'api/customers/';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                name,
                industry
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Something went wrong')
            }
            return response.json()
        }).then((data) => {
            toggleShow();
            setCustomers((prev) => {
                return [...prev, data.customer]
            })

        }).catch((e) => {
            console.log(e)
        })
    }

    return (
        <div>
            <h1>Here are our customer(s):</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 py-2">
                {customers ? customers.map((customer) => {
                    return (
                        <div
                            key={customer.id}
                            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                        >
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-rose-200"></div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <Link to={'/customers/' + customer.id} className="no-underline">
                                    <p className="text-sm font-medium text-gray-900 mb-0">{customer.name}</p>
                                    <p className="truncate text-sm text-gray-500 mb-0">{customer.industry}</p>
                                </Link>
                            </div>
                        </div>
                    );
                })
                    :
                    'Fetching cutomers...'
                }
            </div>
            <AddCustomer newCustomer={newCustomer} show={show} toggleShow={toggleShow} />
        </div>
    );
}