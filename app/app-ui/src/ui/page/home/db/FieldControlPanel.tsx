import React, { useState } from 'react';
import { Box, Button, Stack, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import AddFieldDialog from './AddFieldDialog.js';
import { setSelectFieldType, FieldType, addField } from './DbSlice.js';
import { useAppDispatch } from '@/store.js';

export default function FieldControlPanel() {
  const dispatch = useAppDispatch();
  const { selectedTable, selectFieldType, fieldList } = useSelector((state: any) => state.db);

  const [openAddFieldDialog, setOpenAddFieldDialog] = useState(false);

  return (
    <Box sx={{ width: 160, p: 2 }}>
      <Stack spacing={2}>
        <Button
          variant={selectFieldType === FieldType.All ? 'contained' : 'outlined'}
          onClick={() =>  dispatch(setSelectFieldType(FieldType.All))}
          fullWidth
        >
          全部
        </Button>
        <Button
          variant={selectFieldType === FieldType.Data ? 'contained' : 'outlined'}
          onClick={() => dispatch(setSelectFieldType(FieldType.Data))}
          fullWidth
        >
          数据
        </Button>
        <Button
          variant={selectFieldType === FieldType.Primary ? 'contained' : 'outlined'}
          onClick={() => dispatch(setSelectFieldType(FieldType.Primary))}
          fullWidth
        >
          主键
        </Button>
        <Button
          variant={selectFieldType === FieldType.Foreign ? 'contained' : 'outlined'}
          onClick={() => dispatch(setSelectFieldType(FieldType.Foreign))}
          fullWidth
        >
          外键
        </Button>

        <Divider />

        {selectedTable && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenAddFieldDialog(true)}
            fullWidth
          >
            添加字段
          </Button>
        )}
      </Stack>

      <AddFieldDialog
        open={openAddFieldDialog}
        onClose={() => setOpenAddFieldDialog(false)}
        onSubmit={(fieldData) => {
          dispatch(addField(fieldData));
        }}
        fieldList={fieldList}
      />
    </Box>
  );
}