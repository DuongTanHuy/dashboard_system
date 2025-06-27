import { Stack, TextField, Typography } from '@mui/material';
import WithSectionAction from '../components/WithSelectionAction';

const PropTypes = require('prop-types');

const TextareaContent = ({ data, selectingItem }) => (
  <WithSectionAction isActive={data.id === selectingItem?.id}>
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      sx={{
        ...data?.styleDefault,
        width: '100%',
        overflow: 'hidden',
        height: `${data?.config?.height}px`,
        transition: 'all 0.3s',
      }}
    >
      {!data?.config?.hideLabel && (
        <Typography
          sx={{
            minWidth: '100px',
            width: `${data?.config?.labelWidth}px`,
            transition: 'all 0.3s',
            flexShrink: 0,
          }}
        >
          {data?.config?.name}
        </Typography>
      )}

      <TextField
        multiline
        rows={4}
        value={data?.config?.defaultValue}
        size="small"
        fullWidth
        sx={{
          height: '100%',
          '& .MuiInputBase-root': {
            height: '100%',
          },
          transition: 'all 0.3s',
          ...(data?.config?.width && {
            width: `${data?.config?.width}px`,
          }),
        }}
        inputProps={{
          readOnly: true,
        }}
        placeholder={data?.config?.placeholder}
        InputProps={{
          endAdornment: (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 10,
                ...(!data?.config?.showTextCount && {
                  display: 'none',
                }),
              }}
            >{`${data?.config?.defaultValue.length}/${data?.config?.maxLength ?? 0}`}</Typography>
          ),
        }}
      />
    </Stack>
  </WithSectionAction>
);

TextareaContent.propTypes = {
  data: PropTypes.object,
  selectingItem: PropTypes.object,
};

export default TextareaContent;
