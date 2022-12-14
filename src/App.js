// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import PacketCard from "./components/PacketCard";

function normalizePackets(packets) {
  return packets.reduce(
    (acc, packet) => {
      return {
        packets: {
          ...acc.packets,
          [packet.id]: {
            name: packet.name,
            price: packet.price,
            description: packet.description,
            channels: packet.channels.map((ch) => ch.id),
            short: packet.short
          }, 
        },
        packetsIds: [...acc.packetsIds, packet.id],
      };
    },  
    {
      packets: {},
      packetsIds: [],
    }
  );
}

function normalizeChannels(chennels) {
  const normalizedChannels = chennels.reduce(
    (acc, channel) => {
      return {
        channels: {
          ...acc.channels,
          [channel.id]: channel,
        },
        channelsIds: acc.channelsIds.add(channel.id),
      };
    },
    {
      channels: {},
      channelsIds: new Set(),
    }
  );

  return {
    ...normalizedChannels,
    channelsIds: Array.from(normalizedChannels.channelsIds),
  };
}

function normalizeData(packets) {
  const normalizedPackets = normalizePackets(packets);
  const channels = packets.flatMap((packet) =>
    packet.channels.flatMap((ch) => ({ ...ch, packetId: packet.id }))
  );
  const normalizedChannels = normalizeChannels(channels);
  return {
    ...normalizedChannels,
    ...normalizedPackets,
  };
}

function filterPackets({ packets, packetsIds }, selectedChannels){
  return packetsIds.reduce((acc, id) => {
    for (const ch of selectedChannels) {
      if (!packets[id].channels.includes(ch)) {
        return acc;
      }
    }
    return [...acc, id];
  }, [])
}

function App() {
  const [allForm, setAllForm] = useState([]);

  useEffect(() => {
    axios
      .get("/24h.json")
      .then((res) => setAllForm(res.data))
      .catch((err) => console.log(err));
  }, []);

  const [selectedChannels, setSelected] = useState([]);
  const { channels, channelsIds, packets, packetsIds } = normalizeData(allForm);
  const filteredPacketsIds = filterPackets({packets, packetsIds}, selectedChannels)
  
  console.log(selectedChannels)
  return (
    <div className="wrapper">
      <h1 className="header">Выберите каналы из списка</h1>
      <div className="Auto-form" >
      <h1 className="header marg">Вам подойдут тарифы</h1>
      <Autocomplete
        multiple
        onChange={(_, value) => {
          setSelected(value)
        }}
        value={selectedChannels}
        options={channelsIds}
        getOptionLabel={(id) => channels[id].name}
        filterSelectedOptions
        renderOption={(props, id) => (
          <li {...props}> 
            {channels[id].name}
            <img className="img" src={channels[id].icon} />
          </li>
        )}
        renderInput={(params) => <TextField {...params}/>}
      />
        </div>
      <div className="wrapper__container">
       {filteredPacketsIds.map((id) => (
        <PacketCard packet={packets[id]}/>
      ))} 
      </div>
    </div>
  );
}

export default App;
