import { DataGrid } from '@mui/x-data-grid'
import { ProjectTableProps } from '@/utils/types'

export const ProjectTable: React.FC<ProjectTableProps> = ({
    columns, data, openEdit, rowIsCreativeDesign, sx
}) => {
    return (
        <>
            <DataGrid 
            sx={sx}
            rows={data}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            disableColumnMenu
            />
        </>
    )
}