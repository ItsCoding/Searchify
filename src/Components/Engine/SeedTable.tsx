import React, { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import { Table, Badge, Space } from "antd";
import axios from "axios";

import PitchClass from "../../System/PitchClass";
import { DeleteOutlined } from "@ant-design/icons";
import { mapTitleToHelp } from "../../System/Help";
import { SeedItem } from "../../Types/SeedItem";
import SeedDetailItem from "../../Types/SeedDetailItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


const seedColors = ["#2e7d32", "#c62828", "#4834d4", "#be2edd", "#f0932b"];

type SeedTableProps = {
  seeds: SeedItem[],
  token: string,
  setSeed: React.Dispatch<React.SetStateAction<SeedItem[]>>,
  seedDetails: SeedDetailItem[],
  setSeedDetails: Dispatch<SetStateAction<SeedDetailItem[]>>
}


const SeedTable = ({ seeds, token, setSeed, seedDetails, setSeedDetails }: SeedTableProps) => {

  /**
   * It removes the seed from the list of seeds
   * @param selectedSeed - the seed that was selected to be removed
   */
  const removeSelf = (selectedSeed: SeedDetailItem) => {
    const newSeeds = seeds.filter((s) => s.spotifyseed !== selectedSeed.uri);
    setSeed(newSeeds);
  };

  /* A react hook that is called whenever the seeds change. It is used to update the seed details. */
  useEffect(() => {
    let seedQuery = "";
    if (seeds.length < 1) {
      setSeedDetails([]);
      return;
    }
    const nonTrackSeeds = seeds.filter((s) => s.type !== "track");
    if (nonTrackSeeds.length === seeds.length) {
      const sDetails: SeedDetailItem[] = [];
      nonTrackSeeds.forEach((item) => {
        sDetails.push({
          uri: item.spotifyseed,
          title: item.value,
          cover: item.sthumb,
          type: item.type,
        });
      });
      setSeedDetails(sDetails);
    }
    seeds.forEach((item) => {
      if (item.type === "track") {
        seedQuery += item.spotifyseed.split(":")[2] + ",";
      }
    });
    axios
      .get("https://api.spotify.com/v1/audio-features?ids=" + seedQuery, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        const sDetails: SeedDetailItem[] = result.data.audio_features;
        sDetails.forEach((it) => {
          const se = seeds.find((s) => s.spotifyseed === it?.uri);
          it.title = se?.value ?? "";
          it.cover = se?.sthumb ?? "";
        });
        nonTrackSeeds.forEach((item) => {
          sDetails.push({
            uri: item.spotifyseed,
            title: item.value,
            cover: item.sthumb,
            type: item.type,
          });
        });
        setSeedDetails(sDetails);
      });
  }, [seeds]);

  const keyify = (items: SeedDetailItem[]) => {
    let keyifyed: SeedDetailItem[] = [];
    items.forEach((item) => {
      keyifyed.push({
        ...item,
        toneKey: parseInt(item.key?.toString() ?? "0"),
        key: item.uri,
      });
    });
    return keyifyed;
  }


  /* Defining the columns of the table. */
  const columns = [
    {
      title: "#",
      dataIndex: "cover",
      key: "cover",
      render: (s: string) =>
        s ? <img src={s} alt="" style={{ height: 32, width: 32 }} /> : "",
    },
    {
      title: "Title/Artist/Genre",
      dataIndex: "title",
      key: "title",
      render: (s: string, r: SeedDetailItem, i: number) => (
        <Badge
          className="site-badge-count-109"
          count={s}
          style={{ backgroundColor: seedColors[i] }}
        />
      ),
    },
    {
      title: mapTitleToHelp("Key"),
      dataIndex: "toneKey",
      key: "toneKey",
      render: (s: number) => (s ? PitchClass.keyToPitchClass(s) : "-"),
    },
    {
      title: mapTitleToHelp("Mode"),
      dataIndex: "mode",
      key: "mode",
      render: (s: number, r: SeedDetailItem) =>
        ["audio_features", "track"].includes(r.type ?? "")
          ? s === 1
            ? "Major"
            : "Minor"
          : "-",
    },
    {
      title: mapTitleToHelp("Tempo"),
      dataIndex: "tempo",
      key: "tempo",
      render: (s: number) => (s ? s + " BPM" : "-"),
    },
    {
      title: mapTitleToHelp("Time signature", "time_signature"),
      dataIndex: "time_signature",
      key: "time_signature",
      render: (s: number) => (s ? s + " beats/bar" : "-"),
    },
    {
      title: "#",
      key: "actions",
      render: (s: string, record: SeedDetailItem) => (
        <Space>
          <a>
            <FontAwesomeIcon icon={faTrash} size={"lg"} onClick={() => removeSelf(record)} />
            {/* <DeleteOutlined  /> */}
          </a>
          <a href={record.uri} target="_blank" rel="noreferrer" style={{ color: "#1DB954" }}>
            <FontAwesomeIcon icon={faSpotify} size={"lg"} />
          </a>
        </Space>
      ),
    }
  ];
  return (
    <>
      <Table dataSource={keyify(seedDetails)} columns={columns} pagination={false} />
    </>
  );
};

export default SeedTable;
