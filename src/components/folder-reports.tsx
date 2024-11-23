import React, { useState, useEffect } from "react";
import FolderTabs from "./tabs";
import CSVTable from "./data-table";
import { parseCSV } from "../utils/parse-csv";
import { folderStructure } from "../data/folder-structure";
import { useParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Input } from "./ui/input";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [subFolder,setSubFolder] = useState<any>(undefined);
  const [inputFile,setInputFile] = useState<any>(undefined);

  const params = useParams(); 

  useEffect(() => {
      const currFolder = folderStructure?.folders?.find((folder:any)=>folder?.id==params?.folderId);
      setSubFolder(currFolder);     
  }, []);

  const uploadFile = async ()=>{
    console.log(inputFile);
    const parsedData = await parseCSV(inputFile,true);
    const copySubFolder:any = {...subFolder};
    copySubFolder?.files?.push({name: inputFile?.name,data:parsedData});
    setSubFolder(copySubFolder);
  }

  return (
    <div className="p-4">
      {
        subFolder?.files?.length>0 &&
        (
        <div>
            <AlertDialog>
            <AlertDialogTrigger>
                <Button onClick={(e)=>setInputFile(undefined)}>Add New CSV</Button></AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Upload New CSV</AlertDialogTitle>
                <AlertDialogDescription>
                    <Input type="file" accept=".csv" onChange={(e)=>setInputFile(e?.target?.files?.length ? e?.target?.files?.[0] : undefined)} />
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={(e)=>uploadFile()}>Upload</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
            <FolderTabs
                folders={subFolder?.files}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            {subFolder.files?.map((file:any,index:Number) => {
                return (
                activeTab==index && <div key={file?.name} className="mb-8">
                        <CSVTable folderId={subFolder?.id} fileName={file?.name} data={file?.data} />
                    </div>)
                })
            }    
        </div>
        )
      }
    </div>
  );
};

export default Dashboard;
