/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { KeyIcon } from './icons';

interface ApiKeyDialogProps {
  onContinue: () => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center flex flex-col items-center">
        <div className="bg-indigo-100 p-4 rounded-full mb-6">
          <KeyIcon className="w-12 h-12 text-indigo-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Yêu cầu API Key</h2>
        <p className="text-gray-600 mb-2">
          Để tạo video, vui lòng chọn một API key.
        </p>
         <p className="text-gray-500 mb-8 text-sm">
          Bạn có thể tạo một key mới từ trang cài đặt Google AI Studio của bạn. Đảm bảo rằng dự án Google Cloud được liên kết đã bật thanh toán.
        </p>
        <button
          onClick={onContinue}
          className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-lg"
        >
          Tiếp tục để chọn API Key
        </button>
         <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline mt-4">
            Tìm hiểu về thanh toán
        </a>
      </div>
    </div>
  );
};

export default ApiKeyDialog;