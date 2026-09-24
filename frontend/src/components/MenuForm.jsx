
import React, { useState } from 'react';

export default function MenuForm({ onSaved }){
  const [name,setName]=useState('');
  const [desc,setDesc]=useState('');
  const [price,setPrice]=useState('');
  const [file,setFile]=useState(null);

  const submit = async (e)=>{
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', name);
    fd.append('description', desc);
    fd.append('price', price);
    if (file) fd.append('image', file);

    await fetch('http://localhost:3001/menu', { method:'POST', body: fd });
    setName(''); setDesc(''); setPrice(''); setFile(null);
    if (onSaved) onSaved();
  };

  return (
    <form onSubmit={submit}>
      <div><input required placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} /></div>
      <div><input placeholder="Descrição" value={desc} onChange={e=>setDesc(e.target.value)} /></div>
      <div><input placeholder="Preço" value={price} onChange={e=>setPrice(e.target.value)} /></div>
      <div><input type="file" onChange={e=>setFile(e.target.files[0])} /></div>
      <div><button type="submit">Salvar</button></div>
    </form>
  );
}
