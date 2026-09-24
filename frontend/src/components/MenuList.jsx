
import React from 'react';

export default function MenuList({ items, onDeleted, onUpdated }){
  const remove = async (id)=>{
    await fetch('http://localhost:3001/menu/'+id, { method:'DELETE' });
    if (onDeleted) onDeleted();
  };

  return (
    <div>
      <h3>Itens</h3>
      {items.length===0 && <div>Nenhum item</div>}
      <ul>
        {items.map(i=> (
          <li key={i.id} style={{marginBottom:12}}>
            <strong>{i.name}</strong> - {i.description} - R$ {i.price}
            {i.image && <div><img src={'http://localhost:3001'+i.image} alt="" style={{width:120}}/></div>}
            <div>
              <button onClick={()=>remove(i.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
