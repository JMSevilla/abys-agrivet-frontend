import { DataGrid } from '@mui/x-data-grid'
import { ProjectTableProps } from '@/utils/types'

export const ProjectTable: React.FC<ProjectTableProps> = ({
    columns, data, openEdit, rowIsCreativeDesign, sx, loading
}) => {
    return (
        <>
            <DataGrid 
            loading={loading}
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