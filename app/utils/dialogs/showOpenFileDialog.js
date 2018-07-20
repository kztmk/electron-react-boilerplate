import { dialog } from 'electron';

const showOpenFileDialog = () =>
  new Promise((resolve, reject) => {
    const files = dialog.showOpenDialog({
      title: '寄騎インポートファイルを開く',
      properties: ['openFile'],
      filters: [{ name: '寄騎インポートデータファイル', extensions: ['json'] }]
    });
    if (files && files.length > 0) {
      resolve(files[0]);
    } else {
      reject(new Error('error:-:キャンセル、または、インポート用ファイル名の取得に失敗しました。'));
    }
  });

export default showOpenFileDialog;
