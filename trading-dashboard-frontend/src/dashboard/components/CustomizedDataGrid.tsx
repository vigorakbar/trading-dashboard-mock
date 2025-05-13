import { DataGrid } from '@mui/x-data-grid';
import { columns, rows } from '../internals/data/gridData';
import * as React from 'react';
import { Typography } from '@mui/material';
// apply react.memo
export default React.memo(CustomizedDataGrid);

function CustomizedDataGrid({ symbol }: { symbol: string }) {
  return (
    <>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        {symbol}
      </Typography>
      <DataGrid
        checkboxSelection
        rows={rows}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: 'outlined',
                  size: 'small',
                },
              },
            },
          },
        }}
      />
    </>
  );
}
