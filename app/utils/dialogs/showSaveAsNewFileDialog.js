import { dialog } from 'electron';

const showSaveAsNewFileDialog = () =>
  new Promise((resolve, reject) => {
    const file = dialog.showSaveDialog({
      title: 'エクスポートファイルを保存',
      filters: [{ name: 'エクスポートデータファイル', extensions: ['json'] }]
    });
    if (file) {
      resolve(file);
    } else {
      reject(new Error('エクスポートファイルの作成に失敗しました。'));
    }
  });

export default showSaveAsNewFileDialog;
