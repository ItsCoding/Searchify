import React, { SetStateAction } from "react";
import { Table, Space, message, Tooltip, Progress } from "antd";
import axios from "axios";
// import TrackDetails from "./TrackDetails";
import {
  PlayCircleOutlined,
  PlusCircleOutlined,
  EyeOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import PitchClass from "../../../../System/PitchClass";
import { mapTitleToHelp } from "../../../../System/Help";
import { Dispatch } from "react";
import { SeedItem, SeedType } from "../../../../Types/SeedItem";
import TrackItem from "../../../../Types/TrackItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faPlusCircle, faPlay, faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import SeedDetailItem from "../../../../Types/SeedDetailItem";


/**
 * It takes a number of milliseconds and returns a string in the format of minutes:seconds.
 * @param millis - The number of milliseconds to convert to minutes and seconds.
 * @returns the minutes and seconds of the time in milliseconds.
 */
const millisToMinutesAndSeconds = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (parseFloat(seconds) < 10 ? "0" : "") + seconds;
};


type MediaTableProps = {
  data: Array<TrackItem> | null,
//   token: string,
  // tableDetail,
  setGraphItem: Dispatch<SetStateAction<TrackItem[]>>,
  seeds: Array<SeedItem>,
  setSeed: Dispatch<SetStateAction<SeedItem[]>>,
  seedDetails: Array<SeedDetailItem>,
  // setPlaySong: Dispatch<any>
}

const MediaTable = ({
  data,
  setGraphItem,
  seeds,
  setSeed,
}: MediaTableProps) => {


  /* Defining the columns of the table. */
  const columns = [

    {
      title: "#",
      dataIndex: "cover",
      key: "cover",
      render: (s: string) => <img src={s} alt="" style={{ height: 32, width: 32 }} />,
    },

    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <p>{text}</p>,
    //   sorter: {
    //     compare: (a: TrackItem, b: TrackItem) => a.title.localeCompare(b.title),
    //     // multiple: 5,
    //   },
    },
    {
      title: "Artists",
      dataIndex: "artists",
      key: "artists",
      // ellipsis: true,
    //   sorter: {
    //     compare: (a: TrackItem, b: TrackItem) => a.artists.localeCompare(b.artists),
    //     // multiple: 4,
    //   },
    },
    // {
    //   title: "Album",
    //   dataIndex: "album",
    //   key: "album",
    //   sorter: (a: TrackItem, b: TrackItem) => a.album.localeCompare(b.album),
    // },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    //   sorter: {
    //     compare: (a: TrackItem, b: TrackItem) => a.duration - b.duration,
    //     // multiple: 3,
    //   },
      render: (d: string, r: TrackItem) => millisToMinutesAndSeconds(r.duration),
    },
    {
      title: mapTitleToHelp("Tempo"),
      dataIndex: "tempo",
      key: "tempo",
      render: (s: number) => (s ? s.toFixed(2) + " BPM" : "-"),
      width: 150,
    //   sorter: {
    //     compare: (a: TrackItem, b: TrackItem) => (a.tempo ?? 0) - (b.tempo ?? 0),
    //     // multiple: 1,
    //   },
    },
    {
      title: mapTitleToHelp("Key"),
      dataIndex: "toneKey",
      key: "toneKey",
      render: (s: number) => PitchClass.keyToPitchClass(s),
    //   sorter: {
    //     compare: (a: TrackItem, b: TrackItem) => (a.toneKey ?? 0) - (b.toneKey ?? 0),
    //     // multiple: 2,
    //   },
    },
    {
      title: mapTitleToHelp("Time signature", "time_signature"),
      dataIndex: "time_signature",
      key: "time_signature",
      render: (s: string) => (s ? s + "" : "-"),
    //   sorter: (a: TrackItem, b: TrackItem) => (a.time_signature ?? 0) - (b.time_signature ?? 0),
    },
    {
      title: mapTitleToHelp("Mode"),
      dataIndex: "mode",
      key: "mode",
      render: (s: number) => (s === 1 ? "Major" : "Minor"),
    //   sorter: (a: TrackItem, b: TrackItem) => (a.mode ?? 0) - (b.mode ?? 0),
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: TrackItem) => (
        <Space size="middle">
          <Tooltip placement="top" title={"Add track to seed search"}>
            <a onClick={() => addTrackToSeeds(record)} >
              {/* <PlusCircleOutlined style={{ fontSize: "18px" }} /> */}

              <FontAwesomeIcon icon={faPlusCircle} size={"lg"} />
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];

  /**
   * Adds a track to the seeds array
   * @param track - the track you want to add to the seeds array
   **/
  const addTrackToSeeds = (track: TrackItem) => {
    const newSeed: SeedItem = {
      value: track.title + " - " + track.artists,
      spotifyseed: track.uri,
      key: track.uri,
      type: SeedType.Track,
      sthumb: track.cover,
      label: "",
      artistIDs: track.artistIDs
    };
    if (seeds.length < 5) {
      if (!seeds.find((seed) => seed.key === newSeed.key)) {
        setSeed((prev) => {
          return [...prev, newSeed];
        });
      } else {
        message.warning("You can only select one of each");
      }
    } else {
      message.warning("Only five artists, songs or genres can be selected");
    }
  };

  return (
    <Table
      columns={columns}
      dataSource={data ?? []}
      loading={data === null}
      showSorterTooltip={false}
      onRow={(record: TrackItem) => {
        return {
          onMouseEnter: () => {
            setGraphItem((prev) => {

              //loose reference to the object so we can update it
              let recordCopy = {
                ...record,
              }
              recordCopy.fromHover = true;
              recordCopy.title = recordCopy.title + " - " + recordCopy.artists;
              return [...prev.filter((s) => !s.fromHover), recordCopy];
            });
          }
        };
      }}
    />
  );
};

export default MediaTable;
