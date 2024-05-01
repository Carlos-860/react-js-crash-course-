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
            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {customers ? customers.map((customer) => {
                    return (
                        <li key={customer.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                            <div className="flex w-full items-center justify-between space-x-6 p-6">
                                <div className="flex-1 truncate">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="truncate text-sm font-medium text-gray-900">{customer.name}</h3>
                                        <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            {customer.industry}
                                        </span>
                                    </div>
                                    <p className="mt-1 truncate text-sm text-gray-500">{customer.industry}</p>
                                </div>
                                <img className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" src="" alt="" />
                            </div>
                            <div>
                                <div className="-mt-px flex divide-x divide-gray-200">
                                    <div className="flex w-0 flex-1">
                                        <a
                                            href="#"
                                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                        >
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            Email
                                        </a>
                                    </div>
                                    <div className="-ml-px flex w-0 flex-1">
                                        <Link to={'/customers/' + customer.id}
                                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                        >
                                            <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </li>
                    )
                })
                    :
                    'Fetching cutomers...'
                }
            </ul>
            <AddCustomer newCustomer={newCustomer} show={show} toggleShow={toggleShow} />
        </div>
    );
}