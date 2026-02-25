import React from 'react'

function LeadRow({ lead, isEditing, editinglead, handleChange, handleStatusChange, handleSave, handleEdit, handleDelete }) {

    if (isEditing && editinglead.id === lead.id) {
        return (
            <tr className={`${lead.id % 2 === 0 ? 'bg-slate-200' : ''} border-b cursor-pointer`}>
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
                        value={editinglead.status ?? ''}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                    </select>
                </td>
                <td className="p-4">
                    <textarea
                        onChange={(e) => handleChange(e)}
                        className="p-1.5 border rounded w-full resize-none"
                        name="notes"
                        rows={2}
                        value={editinglead.notes ?? ''}
                        placeholder="Notes..."
                    />
                </td>
                <td className="p-4 space-x-2">
                    <button onClick={() => handleSave()} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Save ✅</button>
                </td>
            </tr>
        )
    }

    return (
        <tr className={`${lead.id % 2 === 0 ? 'bg-slate-200' : ''} border-b cursor-pointer`}>
            <td className="p-4">{lead.id}</td>
            <td className="p-4">{lead.name}</td>
            <td className="p-4">{lead.email}</td>
            <td className="p-4">{lead.phone}</td>
            <td className="p-4">{lead.company.name}</td>
            <td className="p-4">{lead.website}</td>
            <td className="p-4">{lead.status}</td>
            <td className="p-4 max-w-[150px] truncate" title={lead.notes}>{lead.notes || '—'}</td>
            <td className="p-4 space-x-2">
                <button onClick={() => handleEdit(lead)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                <button onClick={() => handleDelete(lead.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            </td>
        </tr>
    )
}

export default React.memo(LeadRow)
