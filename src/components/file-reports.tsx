import { useParams } from "react-router-dom";
import CSVTable from "./data-table";


export default function FileReports(){
    const params = useParams();
    if(!params?.folderId || !params?.fileId){
        return (
            <div>No File Exists</div>
        )
    }
    return (
        <div>
            <CSVTable folderId={params?.folderId} fileName={params?.fileId} />
        </div>
    )
}