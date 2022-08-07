import { Tree, Input, List, Avatar } from "antd"
import { Key, useEffect, useState } from "react";
import type { DataNode } from 'antd/es/tree';
import { SpotifyPlaylist } from "../../../../Types/SpotifyPlaylist";
import { ApiService } from "../../../../System/ApiService";
const { Search } = Input;

type TreeSidebarProps = {
    token: string,
    selectPlaylist: (playlist: SpotifyPlaylist) => Promise<void>
}

function getWordStr(str: string) {
    let newString = str.split(/\s+/).slice(0, 10).join(" ");
    if (str !== newString) {
        newString += "...";
    }
    return newString;
}

export const TreeSidebar = ({ token, selectPlaylist }: TreeSidebarProps) => {
    const [dataList, setDataList] = useState<SpotifyPlaylist[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const apiService = new ApiService(token);

    useEffect(() => {
        console.log("Loading Playlists")
        loadData();
    }, [])

    const loadData = async () => {
        const data = await apiService.getPlaylists();
        setDataList(data);
        console.log(data)
    }

    const filterData = (): SpotifyPlaylist[] => {
        return dataList.filter(playlist => playlist.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    const onItemClick = (item: SpotifyPlaylist) => {
        selectPlaylist(item);
    }
    return (<>
        <Search onChange={(e) => setSearchTerm(e.target.value)} style={{ marginBottom: 8 }} placeholder="Search" />
        <List
            itemLayout="horizontal"
            dataSource={filterData()}
            renderItem={item => (
                <List.Item onClick={() => onItemClick(item)} style={{ cursor: "pointer" }}>
                    <List.Item.Meta
                        avatar={<img style={{
                            width: "42px",
                        }} src={item.image}></img>}
                        title={<a>{item.name}</a>}
                    // description={getWordStr(item.description)}
                    />
                </List.Item>
            )}
        />
    </>)
}