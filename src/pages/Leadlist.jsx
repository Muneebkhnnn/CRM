import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Leadform from '../components/Leadform'
function Leadlist() {

    const [leads, setleads] = useState([])
    const [open, setOpen] = useState(false)
    const [editinglead, setEditinglead] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [filteredStatus, setfilteredStatus] = useState('')

    const getLeads = async () => {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/users')
            console.log(response.data)
            setleads(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getLeads()
        console.log('render')
    }, [])

    const handleSubmit = (newLead) => {
        setleads([...leads, {
            id: leads.length + 1,
            name: newLead.name,
            email: newLead.email,
            phone: newLead.phone,
            company: { name: newLead.company },
            website: newLead.leadSource,
            status: newLead.leadStatus
        }])
        setOpen(false)
    }

    const handleDelete = (id) => {
        setleads((leads) => {
            return leads.filter(lead => lead.id !== id)
        })
    }

    const handleEdit = (lead) => {
        setEditinglead(lead)
        setIsEditing(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        console.log(name, value)
        console.log(editinglead)

        setEditinglead(lead => ({
            ...lead,
            ...(name === 'company'
                ? { company: { ...lead.company, name: value } }
                : { [name]: value })
        }))
    }

    const handleSave = () => {
        const allLeads = leads.slice()
        const newLeads = allLeads.map((lead) => {
            return lead.id === editinglead.id ? editinglead : lead
        })
        setleads(newLeads)
        console.log(newLeads)
        setIsEditing(false)
        setEditinglead({})
    }


    let filteredLeads = leads.filter((lead) => {

        if (!(searchValue.trim()) && !filteredStatus) return true;


        if (filteredStatus && searchValue) {
            return (
                lead.status === filteredStatus &&
                (
                    lead.name.toLowerCase().includes(searchValue) ||
                    lead.company?.name?.toLowerCase().includes(searchValue)
                )
            );
        }
        else if (filteredStatus) {
            return lead.status === filteredStatus;
        }
        else {
            return (
                lead.name.toLowerCase().includes(searchValue) ||
                lead.company?.name?.toLowerCase().includes(searchValue)
            );
        }
    });

    console.log(filteredLeads)

    const handleSearch = (name) => {
        const value = name.toLowerCase()
        console.log(value)
        setSearchValue(value)

    }

    const handleStatusFilter = (statusFilter) => {
        console.log(statusFilter)
        setfilteredStatus(statusFilter)
    }

    const handleStatusChange = (id, status) => {

        setleads((prev) => {
            return prev.map(lead =>
                lead.id === id ? { ...lead, status: status } : lead
            )
        })

        setEditinglead(prev =>
            prev.id === id ? { ...prev, status } : prev
        )

    }
    console.log(leads)

    return (
        <>
            {open && (
                <Leadform onClose={() => setOpen(false)} onSubmit={handleSubmit} />
            )}

            <div className={` ${open ? 'opacity-50' : ''} min-h-screen pt-16`}>
                <div className='flex gap-6 mt-2.5 ml-4 justify-baseline'>
                    <select onChange={(e) => handleStatusFilter(e.target.value)} name="Status" className="px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                        <option value="">Filter By</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                    </select>
                    <span className='flex justify-center items-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'>

                        <input
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="px-3 py-2 pr-6 focus:outline-none"
                            type="text"
                            placeholder='Search by Name, Company name'

                        />
                        <svg
                            className="mr-3 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </span>

                    <span className=''>
                        <button onClick={() => setOpen(true)} className='cursor-pointer  px-2 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'>Add Lead 📃</button>
                    </span>

                </div>
                <div className="overflow-x-auto mx-8 my-6 bg-white rounded-lg shadow-sm border border-gray-200">
                    <table className="w-full h-full text-sm ">
                        <thead className="bg-indigo-100 text-indigo-900">
                            <tr>
                                <th className="p-4 text-left font-semibold">Sr no.</th>
                                <th className="p-4 text-left font-semibold">Name</th>
                                <th className="p-4 text-left font-semibold">Email</th>
                                <th className="p-4 text-left font-semibold">Phone No.</th>
                                <th className="p-4 text-left font-semibold">Company name</th>
                                <th className="p-4 text-left font-semibold">Lead Source</th>
                                <th className="p-4 text-left font-semibold">Lead Status</th>
                                <th className="p-4 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredLeads.map((lead) =>
                                isEditing && editinglead.id === lead.id ? (
                                    <tr key={lead.id} className={`${lead.id % 2 === 0 ? 'bg-slate-200' : ''} border-b cursor-pointer`}>
                                        <td className="p-4">{lead.id}</td>
                                        <td className="p-4">
                                            <input className="p-1.5" onChange={(e) => handleChange(e)} type="text" name='name' value={editinglead.name} />
                                        </td>
                                        <td className="p-4"> <input onChange={(e) => handleChange(e)} className="p-1.5" type="email" name='email' value={editinglead.email} /></td>
                                        <td className="p-4"> <input onChange={(e) => handleChange(e)} className="p-1.5" type="text" name='phone' value={editinglead.phone} /></td>
                                        <td className="p-4"> <input onChange={(e) => handleChange(e)} className="p-1.5" type="text" name='company' value={editinglead.company?.name || ''} /></td>
                                        <td className="p-4"><input onChange={(e) => handleChange(e)} className="p-1.5" type="text" name='website' value={editinglead.website} /></td>
                                        <td className="p-4">
                                            <select
                                                className="border rounded px-2 py-1"
                                                value={editinglead.status ?? 'select'}
                                                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            >
                                                <option value="">{lead.status ?? 'select'}</option>
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Follow-up">Follow-up</option>
                                                <option value="Converted">Converted</option>
                                                <option value="Lost">Lost</option>
                                            </select>
                                        </td>
                                        <td className="p-4 space-x-2">
                                            <button onClick={() => handleSave()} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Save ✅</button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={lead.id} className={`${lead.id % 2 === 0 ? 'bg-slate-200' : ''} border-b cursor-pointer`}>
                                        <td className="p-4">{lead.id}</td>
                                        <td className="p-4">{lead.name}</td>
                                        <td className="p-4">{lead.email}</td>
                                        <td className="p-4">{lead.phone}</td>
                                        <td className="p-4">{lead.company.name}</td>
                                        <td className="p-4">{lead.website}</td>
                                        <td className="p-4">
                                            <select disabled name="Status" className="border rounded px-2 py-1">
                                                <option value="">{lead.status ?? 'select'}</option>
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Follow-up">Follow-up</option>
                                                <option value="Converted">Converted</option>
                                                <option value="Lost">Lost</option>
                                            </select>
                                        </td>
                                        <td className="p-4 space-x-2">
                                            <button onClick={() => handleEdit(lead)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                                            <button onClick={() => handleDelete(lead.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>

                </div>
            </div >
        </>
    )
}
/* Lead Name
• Email
• Phone Number
• Company Name
• Lead Source (Website / Referral / LinkedIn / Other)
• Lead Status
o New
o Contacted
o Follow-up
o Converted
o Lost
Each lead must have:
• Edit button
• Delete button */

export default Leadlist