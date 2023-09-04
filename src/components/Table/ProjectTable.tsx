import { DataGrid } from '@mui/x-data-grid'
import { ProjectTableProps } from '@/utils/types'

export const ProjectTable: React.FC<ProjectTableProps> = ({
    columns, data, openEdit, rowIsCreativeDesign, sx, loading,
    page, pageSize, handlePageChange
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
            pagination
            initialState={{
                pagination: { paginationModel: {pageSize: pageSize}}
            }}
            pageSizeOptions={[5, 10, 25]}
            />
        </>
    )
}