import { useEffect,useState } from "react";
import { folderStructure } from "../data/folder-structure.js";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Button } from "./ui/button.js";
import { Input } from "./ui/input.js";
import { CircleX } from "lucide-react";
import { Switch } from "./ui/switch.js";
import { Link } from "react-router-dom";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

export default function Home(){
    const [folders,setFolders] = useState<any>([]);
    const [tagsInput,setTagsInput] = useState<string[]>([]);
    const [tags,setTags] = useState<string[]>([]);
    const [showTags,setShowTags] = useState<string[]>([]);
    useEffect(()=>{
        setTags([]);
        setShowTags([]);
        updateSubFolders();
    },[]);

    const updateSubFolders = ()=>{
        const folderData:any = [];
        const inputList:string[] = [];
        for(let folder of folderStructure?.folders){
            inputList.push("");
            folderData?.push({
                ...folder,
                status: 'Active',
                tags: []
            })
        }
        setTagsInput(()=>[...inputList]);
        setFolders(()=>[...folderData]);
    }

    const updateStatus = (id:number)=>{
        const copyFolder = [...folders];
        for(let folder of copyFolder){
            if(folder?.id==id){
                folder['status'] = folder['status']=='Active'?'Inactive':'Active';
            }
        }
        setFolders([...copyFolder]);
    }

    const updateTagInput = (val:string,index:number)=>{
        const inputList = [...tagsInput];
        inputList[index] = val;
        setTagsInput(()=>[...inputList]);
    }

    const updateTag = (index:number,id:number)=>{
        const inputList = [...tagsInput];
        const tag = inputList[index];
        inputList[index] = "";
        const copyFolder = [...folders];
        for(let folder of copyFolder){
            if(folder?.id==id){
                if(!folder?.tags?.includes(tag)){
                    folder.tags.unshift(tag);
                }
                break;
            }
        }
        if(!tags?.includes(tag))setTags((tags)=>[...tags,tag]);
        setTagsInput(()=>[...inputList]);
        setFolders([...copyFolder]);
    }

    const updateShowTags = (tag:string)=>{
        let copyShowTags = [...showTags];
        if(copyShowTags?.includes(tag)){
            copyShowTags = copyShowTags?.filter((showTag)=>showTag!=tag);
        }
        else{
            copyShowTags?.push(tag);
        }
        setShowTags([...copyShowTags]);
    }

    const checkForTags = (folder:any)=>{
        if(!folder?.tags?.length) return false;
        for(let tag of showTags){
            if(folder?.tags?.includes(tag)) return true;
        }
        return false;
    }

    const removeTag = (id:number,tag:string)=>{
        let copyFolder = [...folders];
        let copyTags = [...tags];
        let copyShowTags = [...showTags];
        for(let folder of copyFolder){
            if(folder?.id==id){
                if(folder?.tags?.includes(tag)){
                    folder.tags = folder?.tags?.filter((t:string)=>t!=tag);
                }
                break;
            }
        }
        setFolders([...copyFolder]);
        for(let folder of copyFolder){
            if(folder?.tags?.includes(tag)){
                return;
            }
        }
        copyTags = copyTags?.filter((t:string)=>t!=tag);
        copyShowTags = copyShowTags?.filter((t:string)=>t!=tag);
        setTags([...copyTags]);
        setShowTags([...copyShowTags]);
    }

    return (
        <div>
            <Table>
                <TableCaption>All your subfolders will be displayed here.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Folder Name</TableHead>
                        <TableHead>File Count</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">
                            <span className="mr-2">Tags</span>
                            {tags?.length>0 && <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="p-0 border-0">🔽</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>Available Tags</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {tags.length>0 && (
                                            tags.map((tag:string)=>{
                                                return (<DropdownMenuCheckboxItem
                                                    checked={showTags.includes(tag)}
                                                    onCheckedChange={(e)=>updateShowTags(tag)}
                                                    >
                                                    {tag}
                                                </DropdownMenuCheckboxItem>)
                                            })
                                        )
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {folders?.map((folder:any,index:number)=>{
                        {return (!showTags?.length || checkForTags(folder)) ? (
                            <TableRow>
                                <TableCell className="font-medium">
                                    {folder?.status=='Inactive' ? <Button disabled={folder?.status=='Inactive'}>{folder?.name}</Button> : <Link to={`/reports/sub-folder/${folder?.id}`}>
                                        <Button disabled={folder?.status=='Inactive'}>{folder?.name}</Button>
                                    </Link>}
                                </TableCell>
                                <TableCell>{folder?.files?.length}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={folder?.status=='Active'}
                                        onCheckedChange={(e)=>updateStatus(folder?.id)}
                                        aria-readonly
                                    />
                                </TableCell>
                                <TableCell className="flex flex-row justify-center">
                                    <div className="flex flex-row">
                                        <Input value={tagsInput[index]} onChange={(e)=>updateTagInput(e?.target?.value,index)} type="text" placeholder="Enter Tag" className="w-40" />
                                        <Button className="ml-2 bg-blue-400" variant="outline" onClick={(e)=>updateTag(index,folder?.id)}>Add</Button>
                                    </div>
                                    <div className="py-2 ml-2">
                                        {folder?.tags?.map((tag:string)=>{
                                            return <Button className="px-2 py-0 h-6" onClick={(e)=>removeTag(folder?.id,tag)}>
                                            <CircleX className="w-10" /> {tag}
                                          </Button>
                                        })}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ):
                        null }
                    })}
                </TableBody>
            </Table>
        </div>
    )
}