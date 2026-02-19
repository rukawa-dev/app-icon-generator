
import { IconConfig } from './types';

export const DEFAULT_CONFIG: IconConfig = {
  text: 'F',
  fontSize: 500, 
  fontFamily: 'Nunito',
  fontVariant: 'normal', 
  fontWeight: '900',
  fontColor: '#FFFFFF',
  backgroundColor: '#209CEE',
  shape: 'square',
  useIcon: false,
  iconName: 'home'
};

export const COLOR_PALETTE = [
  '#FFB7B7', '#FFD8B7', '#FFF5B7', '#E1FFB7', '#B7FFBB', '#B7FFFF', '#B7D8FF', '#B7B7FF', '#E1B7FF', '#FFB7F5',
  '#FF6B6B', '#FFB366', '#FFF066', '#C1FF66', '#66FF72', '#66FFFF', '#66B1FF', '#6666FF', '#C166FF', '#FF66EB',
  '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF',
  '#CC0000', '#CC6600', '#CCCC00', '#66CC00', '#00CC00', '#00CCCC', '#0066CC', '#0000CC', '#6600CC', '#CC00CC',
  '#800000', '#804000', '#808000', '#408000', '#008000', '#008080', '#004080', '#000080', '#400080', '#800080',
  '#4D0000', '#4D2600', '#4D4D00', '#264D00', '#004D00', '#004D4D', '#00264D', '#00004D', '#26004D', '#4D004D',
  '#FFFFFF', '#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC', '#BFBFBF', '#B3B3B3', '#A6A6A6', '#999999', '#8C8C8C',
  '#808080', '#737373', '#666666', '#595959', '#4D4D4D', '#404040', '#333333', '#262626', '#1A1A1A', '#0D0D0D',
  '#000000'
];

export const POPULAR_FONTS = [
  'Inter',
  'Roboto',
  'Poppins',
  'Montserrat',
  'Open Sans',
  'Lato',
  'IBM Plex Sans',
  'DM Sans',
  'Quicksand',
  'Nunito'
];

export const FONT_WEIGHTS = [
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'SemiBold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Black', value: '900' },
];

export const POPULAR_ICONS = [
  // Action
  'home', 'search', 'settings', 'favorite', 'delete', 'account_circle', 'shopping_cart', 'info',
  'check_circle', 'visibility', 'logout', 'help', 'lock', 'calendar_today', 'verified', 'stars',
  'thumb_up', 'grade', 'build', 'play_arrow', 'face', 'history', 'event', 'paid', 'print',
  'update', 'explore', 'done', 'done_all', 'alarm', 'account_balance', 'assignment',
  // Communication
  'mail', 'call', 'chat', 'forum', 'contact_phone', 'message', 'contact_mail', 'voicemail',
  'rss_feed', 'alternate_email', 'speaker_notes', 'add_comment', 'mark_as_unread', 'phone_enabled',
  // Content
  'add', 'inventory', 'archive', 'drafts', 'send', 'link', 'create', 'flag', 'save', 'font_download',
  'report', 'select_all', 'content_copy', 'content_cut', 'content_paste', 'reply', 'forward',
  // Editing
  'edit', 'brush', 'palette', 'mode_edit', 'draw', 'content_paste_go', 'highlight', 'format_bold',
  'format_italic', 'format_list_bulleted', 'format_list_numbered', 'attachment', 'insert_link',
  // File
  'folder', 'file_download', 'file_upload', 'attach_file', 'cloud', 'cloud_upload', 'cloud_download',
  'drive_file_rename_outline', 'folder_open', 'text_snippet', 'grid_view', 'upload_file',
  // Navigation
  'menu', 'arrow_forward', 'arrow_back', 'chevron_right', 'chevron_left', 'close', 'more_vert',
  'more_horiz', 'refresh', 'expand_more', 'expand_less', 'apps', 'check', 'arrow_upward', 'arrow_downward',
  // Social
  'person', 'group', 'share', 'thumb_up_alt', 'public', 'sentiment_satisfied', 'sentiment_very_satisfied',
  'rocket_launch', 'celebration', 'cake', 'emoji_events', 'school', 'psychology', 'group_add',
  // Places
  'place', 'location_on', 'map', 'restaurant', 'hotel', 'flight', 'directions_car', 'park', 'church',
  'museum', 'local_gas_station', 'local_hospital', 'local_pharmacy', 'local_pizza',
  // Media
  'camera_alt', 'videocam', 'image', 'photo_library', 'audiotrack', 'music_note', 'movie', 'mic',
  'radio', 'speed', 'playlist_add', 'timer', 'volume_up', 'pause', 'stop', 'equalizer',
  // Devices
  'smartphone', 'laptop', 'desktop_windows', 'tv', 'watch', 'mouse', 'keyboard', 'headphones',
  'router', 'speaker', 'memory', 'battery_full', 'wifi', 'bluetooth', 'nfc',
  // Brand/Other
  'bolt', 'eco', 'language', 'auto_fix_high', 'diamond', 'pets', 'spa', 'ac_unit', 'lightbulb',
  'wb_sunny', 'nightlight_round', 'fingerprint', 'key', 'token', 'security', 'shield', 'vpn_key',
  'shopping_bag', 'support_agent', 'work', 'travel_explore', 'qr_code', 'bar_chart', 'trending_up'
];
