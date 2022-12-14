import React from "react";

export default function PacketCard({ packet }) {
  return (
    <div className="content-form">
      <div className="content-form-name">{packet.name}</div>
      <div className="content-form-price">{packet.price} Р</div>
      <div className="content-form-short">{packet.short}</div>
    </div>
  );
}
