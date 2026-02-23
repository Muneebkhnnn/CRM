import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Leadform from '../components/Leadform'
function Leadlist() {

    const [leads, setleads] = useState([])
    const [open, setOpen] = useState(false)
    const [editinglead, setEditinglead] = useState({})
    const [isEditing, setIsEditing] = useState(false)

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
            return leads.filter(lead => lead.id != id)
        })
    }

    const handleEdit = (lead) => {
        setEditinglead(lead)
        setIsEditing(true)
    }

    return (
        <>
            {open && (
                <Leadform onClose={() => setOpen(false)} onSubmit={handleSubmit} />
            )}

            <div className={` ${open ? 'opacity-50' : ''} min-h-screen pt-16`}>
                <div className='flex gap-6 mt-2.5 ml-4 relative'>
                    <select name="Status" className="px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                        <option value="">Filter By</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                    </select>
                    <span className='relative border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'>

                        <input
                            className="px-4 py-2 pr-10 "
                            type="text"
                            placeholder='Search by Name, Company name'

                        />
                        <svg
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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

                    <span className='absolute right-12'>
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
                            {leads.map((lead) =>
                                editinglead.id === lead.id ? (
                                    <tr key={lead.id} className={`${lead.id % 2 == 0 ? 'bg-slate-200' : ''} border-b cursor-pointer`}>
                                        <td className="p-4">{lead.id}</td>
                                        <td className="p-4">
                                            <input type="text" value={lead.name} />
                                        </td>
                                        <td className="p-4">{lead.email}</td>
                                        <td className="p-4">{lead.phone}</td>
                                        <td className="p-4">{lead.company.name}</td>
                                        <td className="p-4">{lead.website}</td>
                                        <td className="p-4">
                                            <select name="Status" className="border rounded px-2 py-1">
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
                                    <tr key={lead.id} className={`${lead.id % 2 == 0 ? 'bg-slate-200' : ''} border-b cursor-pointer`}>
                                        <td className="p-4">{lead.id}</td>
                                        <td className="p-4">{lead.name}</td>
                                        <td className="p-4">{lead.email}</td>
                                        <td className="p-4">{lead.phone}</td>
                                        <td className="p-4">{lead.company.name}</td>
                                        <td className="p-4">{lead.website}</td>
                                        <td className="p-4">
                                            <select name="Status" className="border rounded px-2 py-1">
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