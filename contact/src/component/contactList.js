import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './contactList.css' ;

function ContactList() {

    // states 

const [contacts, setContacts] = useState([]);
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [editContact, setEditContact] = useState(null);

// functions 

const handleInputChange = event => {
const { name, value } = event.target;
if (name === 'name') {
    setName(value);
} else if (name === 'email') {
    setEmail(value);
} else if (name === 'phone') {
    setPhone(value);
}
};

//add contacts
const handleAddContact = event => {
event.preventDefault();
const newContact = { name, email, phone };
axios
    .post('https://jsonplaceholder.typicode.com/users', newContact)
    .then(response => {
    setContacts([...contacts, response.data]);
    setName('');
    setEmail('');
    setPhone('');
    })
    .catch(error => {
    console.log(error);
    });
};

const handleEditContact = contact => {
setName(contact.name);
setEmail(contact.email);
setPhone(contact.phone);
setEditContact(contact.id);
};

//updating contacts
const handleUpdateContact = event => {
console.log("update contact ")
event.preventDefault();
const updatedContact = { name, email, phone, id: editContact };
axios
.put(`https://jsonplaceholder.typicode.com/users/${editContact}`, updatedContact)
.then(response => {
    const updatedContacts = contacts.map(contact => {
    if (contact.id === response.data.id) {
        return response.data;
    }
    return contact;
    });
    setContacts(updatedContacts);
    setName('');
    setEmail('');
    setPhone('');
    setEditContact(null);
    })
    .catch(error => {
    console.log(error);
    });
};

//delete contacts

const handleDeleteContact = contact => {
axios
    .delete(`https://jsonplaceholder.typicode.com/users/${contact.id}`)
    .then(response => {
    const updatedContacts = contacts.filter(c => c.id !== contact.id);
    setContacts(updatedContacts);
    })
    .catch(error => {
    console.log(error);
    });
};

//use effect 

useEffect(() => {
    axios
        .get('https://jsonplaceholder.typicode.com/users')
        .then(response => {
        setContacts(response.data);
        })
        .catch(error => {
        console.log(error);
        });
    }, []);
    
    


return (
<div>
    <h1 className='heading'>Contact List</h1>
    <table className='table'>
    <thead>
        <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {contacts.map(contact => (
        <tr key={contact.id}>
            <td>{contact.name}</td>
            <td>{contact.email}</td>
            <td>{contact.phone}</td>
            <td>
            <button className='btns' onClick={() => handleEditContact(contact)}>Edit</button>
            <button className='btns' onClick={() => handleDeleteContact(contact)}>Delete</button>
            </td>
        </tr>
        ))}
    </tbody>
    </table>
    <div className='lowerDiv'>
    <h2> Add/Update Contact</h2>
    <form onSubmit={editContact ? handleUpdateContact : handleAddContact}>
    <label>
        Name:
        <input type="text" name="name" value={name} onChange={handleInputChange} />
    </label>
    <label>
        Email:
        <input type="email" name="email" value={email} onChange={handleInputChange} />
    </label>
    <label>
        Phone:
        <input type="tel" name="phone" value={phone} onChange={handleInputChange} />
    </label>
    <button type="submit">{editContact ? 'Update' : 'Add'}</button>
    </form>
    </div>
</div>
);
}

export default ContactList;
