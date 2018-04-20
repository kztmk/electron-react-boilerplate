import { dialog } from 'electron';

const showOpenFileDialog = () => {
  return new Promise((resolve, reject) => {
    const files = dialog.showOpenDialog({
      title: 'インポート用ファイルを開く',
      properties: ['openFile'],
      filters: [{ name: '寄騎インポートファイル', extensions: ['json'] }]
    });
    if (files && files.length > 0) {
      resolve(files[0]);
    } else {
      reject(new Error('ファイル名の取得に失敗しました。'));
    }
  });
};

export default showOpenFileDialog;
