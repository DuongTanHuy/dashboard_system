import PropTypes from 'prop-types';
import { Editor } from '@monaco-editor/react';
import { Box, Container, TextField, alpha } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingButton } from '@mui/lab';
import { ERROR_CODE } from 'src/utils/constance';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { approvePublicWorkflowApi, rejectPublicWorkflowApi } from 'src/api/workflow.api';
import { flowchartOptions, getFlowchartValue } from 'src/utils/flowchart-options';
import DetailsToolbar from '../details-toolbar';
import WorkflowEngine from '../workflow-engine';

export default function DetailScriptView({ workflowInfo, workflowLoading }) {
  const settings = useSettingsContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scriptContent, setScriptContent] = useState('// Loading...');
  const confirmApprove = useBoolean();
  const confirmReject = useBoolean();
  const [errorMessages, setErrorMessages] = useState('');
  const [editorRef, setEditorRef] = useState(null);

  const [note, setNote] = useState('');

  function handleEditorDidMount(editor, monaco) {
    setEditorRef(editor);
  }

  const handleApprove = async () => {
    try {
      setLoading(true);
      const response = await approvePublicWorkflowApi(workflowInfo.id);
      if (response?.data?.error_code === 'workflow_not_pending') {
        enqueueSnackbar('Workflow đã được duyệt hoặc từ chối!', { variant: 'error' });
        confirmApprove.onFalse();
        return;
      }
      enqueueSnackbar('Bạn đã duyệt workflow này!', { variant: 'success' });
      confirmApprove.onFalse();
      router.push(paths.dashboard.script.list);
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
      } else {
        enqueueSnackbar('Có lỗi đã xẩy ra, vui lòng thử lại sau!', { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!note) {
      setErrorMessages('Vui lòng nhập lý do từ chối!');
      return;
    }
    setErrorMessages('');
    try {
      setLoading(true);
      const response = await rejectPublicWorkflowApi(workflowInfo.id, { reject_message: note });
      if (response?.data?.error_code === 'workflow_not_pending') {
        enqueueSnackbar('Workflow đã được duyệt hoặc từ chối!', { variant: 'error' });
        confirmReject.onFalse();
        return;
      }
      enqueueSnackbar('Bạn đã từ chối workflow này!', { variant: 'success' });
      confirmReject.onFalse();
      router.push(paths.dashboard.script.list);
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
        router.push(paths.dashboard.script.list);
      } else {
        enqueueSnackbar('Có lỗi đã xẩy ra, vui lòng thử lại sau!', { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!workflowLoading) {
      if (workflowInfo?.type === 'script') {
        setScriptContent(workflowInfo?.content);
      } else {
        try {
          const nodes = JSON.parse(workflowInfo?.content?.nodes);
          const edges = workflowInfo?.content?.edges
            ? JSON.parse(workflowInfo?.content?.edges)
            : [];

          const listNode = nodes.map((node) => ({
            ...node,
            data: {
              ...(flowchartOptions.find((item) => item.alias === node.data.alias) || node.data),
              isHighlighted: false,
              nodeOrder: node.id,
            },
            dataFields: {
              ...getFlowchartValue(node.data.alias),
              ...node.dataFields,
            },
            selected: false,
          }));

          const engine = new WorkflowEngine({
            drawflow: {
              nodes: listNode,
              edges,
            },
            variables: workflowInfo?.global_data ?? [],
          });

          engine.init();

          setScriptContent(engine.script);
        } catch (error) {
          console.log(error);
          setScriptContent('// Error...');
        }
      }
    } else {
      setScriptContent('// Loading...');
    }
  }, [workflowInfo?.content, workflowInfo?.global_data, workflowInfo?.type, workflowLoading]);

  useEffect(() => {
    const handleFormatCode = () => {
      editorRef.updateOptions({ readOnly: false });
      editorRef
        .getAction('editor.action.formatDocument')
        .run()
        .then(() => {
          editorRef.setScrollTop(0);
        })
        .catch(() => {
          editorRef.updateOptions({ readOnly: true });
        })
        .finally(() => {
          editorRef.updateOptions({ readOnly: true });
        });
    };
    if (scriptContent && editorRef) {
      handleFormatCode();
    }
  }, [scriptContent, editorRef]);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        height: `calc(100vh - ${settings.themeLayout === 'horizontal' ? 188 : 148}px)`,
      }}
    >
      <DetailsToolbar
        status={workflowInfo?.status}
        name={workflowInfo?.name}
        idScript={workflowInfo?.id}
        handleApprove={confirmApprove.onTrue}
        handleReject={confirmReject.onTrue}
        workflowType={workflowInfo?.type}
      />
      <Box
        sx={{
          width: 1,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          // border: (theme) => `solid 1px ${theme.palette.divider}`,
          boxShadow: (theme) => theme.customShadows.z8,
          height: 1,
          overflow: 'hidden',
        }}
      >
        <Editor
          language="javascript"
          theme={`vs-${settings.themeMode}`}
          value={scriptContent}
          className="review-editor"
          // eslint-disable-next-line react/jsx-no-bind
          onMount={handleEditorDidMount}
          loading={<LoadingScreen />}
        />
      </Box>

      <ConfirmDialog
        open={confirmApprove.value}
        onClose={confirmApprove.onFalse}
        title="Chấp nhận"
        content={<>Bạn chắc chắn muốn chấp nhận workflow này?</>}
        type="approve"
        action={
          <LoadingButton
            loading={loading}
            variant="contained"
            color="primary"
            onClick={() => {
              handleApprove();
            }}
          >
            Chấp nhận
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={confirmReject.value}
        onClose={confirmReject.onFalse}
        title="Từ chối workflow này?"
        content={
          <TextField
            name="note"
            label="Lời nhắn"
            value={note}
            error={Boolean(errorMessages)}
            helperText={errorMessages}
            onChange={(event) => {
              if (errorMessages) setErrorMessages('');
              setNote(event.target.value);
            }}
            multiline
            rows={4}
            fullWidth
            placeholder="Vui lòng viết lý do từ chối..."
            sx={{
              mt: 1,
            }}
          />
        }
        action={
          <LoadingButton
            loading={loading}
            variant="contained"
            color="error"
            onClick={() => {
              handleReject();
            }}
          >
            Từ chối
          </LoadingButton>
        }
      />
    </Container>
  );
}

DetailScriptView.propTypes = {
  workflowInfo: PropTypes.object,
  workflowLoading: PropTypes.bool,
};
