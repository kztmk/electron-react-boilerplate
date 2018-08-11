/* eslint-disable react/no-unused-state,prefer-template */
// @flow
import React from 'react';
import TagsInput from 'react-tagsinput';
// material-ui components
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
// @material-ui/icons
import AddAlert from '@material-ui/icons/AddAlert';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
// core components
import GridContainer from '../../../ui/Grid/GridContainer';
import GridItem from '../../../ui/Grid/GridItem';
import CustomInput from '../../../ui/CustomInput/CustomInput';
import Snackbar from '../../../ui/Snackbar/Snackbar';

import extendedFormsStyle from '../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle';

const groupBox = {
  border: '1px solid #333',
  padding: '20px 0 20px 20px',
  borderRadius: '20px',
  margin: '20px 0'
};

type Props = {
  classes: Object
};

type State = {
  title: string,
  titleState: string,
  description: string,
  descriptionState: string,
  remark: string,
  tags: Array<string>,
  occupation: string,
  category: string,
  nickName: string,
  nickNameState: string,
  spouse: string,
  children: string,
  errorMessage: string,
  openErrorSnackbar: boolean
};

/**
 * blogAccount自動取得時のSeesaa追加情報フォーム
 */
class StepSeesaa extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      titleState: '',
      description: '',
      descriptionState: '',
      remark: '',
      tags: [],
      occupation: '',
      category: '',
      nickName: '',
      nickNameState: '',
      spouse: 'S',
      children: 'N',
      errorMessage: '',
      openErrorSnackbar: false
    };
  }

  /**
   * ブログ作成時に必要な情報を親フォームに送る
   */
  sendState = () => {
    const blogParams = [];
    blogParams.title = this.state.title;
    blogParams.description = this.state.description;
    blogParams.remark = this.state.remark;
    blogParams.tags = this.state.tags.length === 0 ? this.state.tags.join(',') : '';
    blogParams.nickName = this.state.nickName;
    blogParams.occupation = this.state.occupationValue;
    blogParams.category = this.state.categoryValue;
    blogParams.spouse = this.state.spouse;
    blogParams.children = this.state.children;

    return blogParams;
  };

  /**
   * キャンセル、完了時にstateを初期化
   */
  initState = () => {
    this.setState({
      title: '',
      titleState: '',
      description: '',
      descriptionState: '',
      remark: '',
      tags: [],
      occupation: '',
      category: '',
      nickName: '',
      nickNameState: '',
      spouse: 'S',
      children: 'N',
      errorMessage: '',
      openErrorSnackbar: false
    });
  };

  /**
   * 職業選択
   *
   * @returns {any[]}
   */
  getOccupations = () => {
    const occupations = [
      { val: '01', occupation: '公務員/団体職員' },
      { val: '02', occupation: '会社員' },
      { val: '03', occupation: '会社役員' },
      { val: '04', occupation: '個人事業主' },
      { val: '05', occupation: '専業主婦' },
      { val: '06', occupation: 'フリーター' },
      { val: '07', occupation: '学生' },
      { val: '08', occupation: 'タレント業' },
      { val: '09', occupation: '休職中/無職' },
      { val: '99', occupation: 'その他' }
    ];
    const { classes } = this.props;

    return occupations.map(q => (
      <MenuItem
        key={q.val}
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected
        }}
        value={q.val}
      >
        {q.occupation}
      </MenuItem>
    ));
  };

  /**
   * カテゴリ選択枝作成
   * @returns {any[]}
   */
  getCategories = () => {
    const categories = [
      { val: '1', category: '生活' },
      { val: '3', category: '地域' },
      { val: '4', category: 'ペット' },
      { val: '5', category: 'ベビー/子育て' },
      { val: '6', category: '恋愛/結婚' },
      { val: '7', category: 'ヘルス/ビューティー' },
      { val: '8', category: 'ダイエット' },
      { val: '9', category: 'ショッピング' },
      { val: '10', category: 'ファッション' },
      { val: '42', category: 'エコロジー' },
      { val: '43', category: 'ボランティア' },
      { val: '11', category: 'グルメ' },
      { val: '12', category: '芸能' },
      { val: '13', category: '音楽/ポッドキャスト' },
      { val: '14', category: 'テレビ/映画/DVD' },
      { val: '15', category: 'ゲーム' },
      { val: '16', category: 'コミック/アニメ' },
      { val: '44', category: '動画' },
      { val: '41', category: 'IT/インターネット' },
      { val: '17', category: 'テクノロジー/科学' },
      { val: '18', category: '本/雑誌' },
      { val: '19', category: '小説/文学' },
      { val: '20', category: '写真/アート' },
      { val: '21', category: '自動車/バイク/自転車' },
      { val: '22', category: '旅行/アウトドア' },
      { val: '23', category: 'スポーツ' },
      { val: '24', category: 'ニュース/時事' },
      { val: '25', category: 'ビジネス' },
      { val: '26', category: '就職/転職' },
      { val: '27', category: 'マネー/ファイナンス' },
      { val: '28', category: 'サークル/部活/学校' },
      { val: '29', category: '留学/海外生活' },
      { val: '30', category: 'ショップ' },
      { val: '31', category: 'サロン' },
      { val: '40', category: 'ギャンブル' },
      { val: '32', category: 'アーティスト' },
      { val: '33', category: '劇団/俳優/女優' },
      { val: '34', category: 'お笑い/タレント' },
      { val: '35', category: 'アイドル/グラビア' },
      { val: '36', category: 'ドクモ/モデル' },
      { val: '37', category: 'アスリート' },
      { val: '39', category: 'age嬢/ホスト' }
    ];

    const { classes } = this.props;
    return categories.map(j => (
      <MenuItem
        key={j.val}
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected
        }}
        value={j.val}
      >
        {j.category}
      </MenuItem>
    ));
  };

  /**
   * 職業を選択
   *
   * @param event
   */
  handleOccupationSelected = event => {
    this.setState({
      occupation: event.target.value
    });
  };

  /**
   * カテゴリを選択
   * @param event
   */
  handleCategorySelected = event => {
    this.setState({
      category: event.target.value
    });
  };

  /**
   * 配偶者radioボタン変更時の処理
   * @param event
   */
  handleChangeSpouse = event => {
    this.setState({ spouse: event.target.value });
  };

  /**
   * 子どもradioボタン変更時の処理
   * @param event
   */
  handleChangeChildren = event => {
    this.setState({ children: event.target.value });
  };

  /**
   * 入力完了時(フォーム移動時)に全入力項目をチェック
   * @returns {boolean}
   */
  isValidate = () => {
    let errorMsg = '';
    if (this.state.titleState !== 'success') {
      errorMsg += 'ブログタイトルの入力を確認してください。。\n';
    }
    if (this.state.descriptionState !== 'success') {
      errorMsg += 'ブログの説明の入力を確認してください。\n';
    }
    if (this.state.category.length === 0) {
      errorMsg += 'ブログカテゴリを選択してください。\n';
    }
    if (this.state.occupation.length === 0) {
      errorMsg += '職業を選択してください。\n';
    }
    if (errorMsg.length > 0) {
      this.setState({
        errorMessage: errorMsg,
        openErrorSnackbar: true
      });
      return false;
    }
    return true;
  };

  /**
   * 入力項目全チェック時にエラー表示を閉じる
   */
  handleErrorSnackbarClose = () => {
    this.setState({ openErrorSnackbar: false });
  };

  requiredField = value => value.length > 3;

  /**
   * フォーム入力時のフィールド毎の処理
   *
   * @param event
   * @param type
   */
  inputFormChange = (event, type) => {
    switch (type) {
      case 'title':
        if (this.requiredField(event.target.value)) {
          this.setState({
            title: event.target.value,
            titleState: 'success'
          });
        } else {
          this.setState({
            title: event.target.value,
            titleState: 'error'
          });
        }
        break;
      case 'description':
        if (this.requiredField(event.target.value)) {
          this.setState({
            description: event.target.value,
            descriptionState: 'success'
          });
        } else {
          this.setState({
            description: event.target.value,
            descriptionState: 'error'
          });
        }
        break;
      case 'remark':
        this.setState({ remark: event.target.value });
        break;
      case 'nickName':
        if (this.requiredField(event.target.value)) {
          this.setState({
            nickName: event.target.value,
            nickNameState: 'success'
          });
        } else {
          this.setState({
            nickName: event.target.value,
            nickNameState: 'error'
          });
        }
        break;
      default:
    }
  };

  /**
   * タグ入力時の処理
   *
   * @param currentTags
   */
  handleTags = currentTags => {
    this.setState({
      tags: currentTags
    });
  };

  /**
   * 描画
   * @returns {*}
   */
  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridContainer style={groupBox}>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={8} md={8}>
              <CustomInput
                success={this.state.titleState === 'success'}
                error={this.state.titleState === 'error'}
                labelText="ブログタイトル"
                id="title"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state.title,
                  type: 'text',
                  onChange: event => this.inputFormChange(event, 'title')
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={8} md={8}>
              <CustomInput
                success={this.state.descriptionState === 'success'}
                error={this.state.descriptionState === 'error'}
                labelText="ブログの説明"
                id="description"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state.description,
                  type: 'text',
                  onChange: event => this.inputFormChange(event, 'description')
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={8} md={8}>
              <CustomInput
                labelText="備考"
                id="remark"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state.remark,
                  type: 'text',
                  onChange: event => this.inputFormChange(event, 'remark')
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer container justify="flex-start">
            <GridItem xs={12} sm={2} md={2}>
              <FormLabel className={classes.labelHorizontal}>タグ:</FormLabel>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <TagsInput
                value={this.state.tags}
                tagProps={{ className: 'react-tagsinput-tag info' }}
                onChange={this.handleTags}
                inputProps={{
                  className: 'react-tagsinput-input-top-padding',
                  placeholder: 'ここへタグを追加'
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <CustomInput
                labelText="ニックネーム"
                id="nickName"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state.nickName,
                  type: 'text',
                  onChange: event => this.inputFormChange(event, 'nickName')
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={4} md={4}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel htmlFor="occupation-select" className={classes.selectLabel}>
                  職業を選択
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={this.state.occupation}
                  onChange={this.handleOccupationSelected}
                  inputProps={{
                    name: 'occupationSelect',
                    id: 'occupation-select'
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    職業を選択
                  </MenuItem>
                  {this.getOccupations()}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel htmlFor="category-select" className={classes.selectLabel}>
                  カテゴリ
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={this.state.category}
                  onChange={this.handleCategorySelected}
                  inputProps={{
                    name: 'categorySelect',
                    id: 'category-select'
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    カテゴリを選択
                  </MenuItem>
                  {this.getCategories()}
                </Select>
              </FormControl>
            </GridItem>
          </GridContainer>
          <GridContainer container justify="center">
            <GridItem xs={12} sm={4} md={4}>
              <div className={classes.checkboxAndRadio + ' ' + classes.checkboxAndRadioHorizontal}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={this.state.spouse === 'S'}
                      onChange={this.handleChangeSpouse}
                      value="S"
                      name="single"
                      aria-label="A"
                      icon={<FiberManualRecord className={classes.radioUnchecked} />}
                      checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                      classes={{
                        checked: classes.radio
                      }}
                    />
                  }
                  classes={{
                    label: classes.label
                  }}
                  label="未婚"
                />
              </div>
              <div className={classes.checkboxAndRadio + ' ' + classes.checkboxAndRadioHorizontal}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={this.state.spouse === 'M'}
                      onChange={this.handleChangeSpouse}
                      value="M"
                      name="married"
                      aria-label="B"
                      icon={<FiberManualRecord className={classes.radioUnchecked} />}
                      checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                      classes={{
                        checked: classes.radio
                      }}
                    />
                  }
                  classes={{
                    label: classes.label
                  }}
                  label="既婚"
                />
              </div>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <div className={classes.checkboxAndRadio + ' ' + classes.checkboxAndRadioHorizontal}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={this.state.children === 'N'}
                      onChange={this.handleChangeChildren}
                      value="N"
                      name="noChild"
                      aria-label="A"
                      icon={<FiberManualRecord className={classes.radioUnchecked} />}
                      checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                      classes={{
                        checked: classes.radio
                      }}
                    />
                  }
                  classes={{
                    label: classes.label
                  }}
                  label="子どもなし"
                />
              </div>
              <div className={classes.checkboxAndRadio + ' ' + classes.checkboxAndRadioHorizontal}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={this.state.children === 'Y'}
                      onChange={this.handleChangeChildren}
                      value="Y"
                      name="hasChild"
                      aria-label="B"
                      icon={<FiberManualRecord className={classes.radioUnchecked} />}
                      checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                      classes={{
                        checked: classes.radio
                      }}
                    />
                  }
                  classes={{
                    label: classes.label
                  }}
                  label="子どもあり"
                />
              </div>
            </GridItem>
          </GridContainer>
        </GridContainer>
        <Snackbar
          color="warning"
          place="bc"
          icon={AddAlert}
          open={this.state.openErrorSnackbar}
          closeNotification={this.handleErrorSnackbarClose}
          close
          message={<span id="login_error">{this.state.errorMessage}</span>}
        />
      </GridContainer>
    );
  }
}

export default withStyles(extendedFormsStyle)(StepSeesaa);
