/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ApiKeyDialog from './components/ApiKeyDialog';
import {generateVideo} from './services/geminiService';
import {
  AspectRatio,
  GenerateVideoParams,
  Job,
  Resolution,
  VeoModel,
  GenerationMode,
  ImageFile,
} from './types';
import {
  ArrowPathIcon,
  CombineIcon,
  FolderIcon,
  Image,
  InfoIcon,
  Layers,
  MessageCircleIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  ScissorsIcon,
  SparklesIcon,
  TextModeIcon,
  Trash2Icon,
  UsersIcon,
  VideoIcon,
  XMarkIcon,
  ZapIcon,
} from './components/icons';

const fileToImageFile = (file: File): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      if (base64) {
        resolve({file, base64});
      } else {
        reject(new Error('Failed to read file as base64.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const AccountInfo: React.FC<{jobCount: number}> = ({jobCount}) => (
  <div className="p-4 border rounded-lg bg-white text-sm">
    <h3 className="font-bold text-gray-800 mb-4">Thông tin tài khoản</h3>
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-600">
      <div>
        <span className="font-semibold">Email:</span> anhvuzzz09@gmail.com
      </div>
      <div>
        <span className="font-semibold">Loại tài khoản:</span> Miễn phí
      </div>
      <div>
        <span className="font-semibold">Ngày hết hạn:</span> 2025-12-15
      </div>
      <div>
        <span className="font-semibold">Đã sử dụng:</span> {jobCount}
      </div>
      <div className="col-span-2">
        <span className="font-semibold">Hạn mức video:</span>{' '}
        <span className="border border-red-400 px-2 py-1 rounded">
          còn {999999 - jobCount} video chưa dùng
        </span>
      </div>
    </div>
  </div>
);

const Instructions: React.FC = () => (
  <div className="p-4 border border-blue-200 bg-blue-50/50 rounded-lg">
    <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
      <InfoIcon className="w-5 h-5" /> Hướng dẫn sử dụng
    </h3>
    <div className="text-xs text-gray-700 space-y-3">
      <div>
        <p className="font-semibold">1) Tạo video từ ảnh hàng loạt</p>
        <p>• Bước 1: Chọn TẤT CẢ ảnh bạn muốn tạo video (ứng dụng sẽ tự sắp xếp theo TÊN FILE ẢNH).</p>
        <p>• Bước 2: Dán HÀNG LOẠT prompt (mỗi dòng một prompt). Ứng dụng sẽ tự gán prompt vào ảnh tương ứng từ trên xuống.</p>
        <p>• LƯU Ý: Bạn có thể click vào mỗi ảnh để chọn ảnh thay thế.</p>
      </div>
      <div>
        <p className="font-semibold">2) Tạo video dài (&gt; 8 giây)</p>
        <p>• Bước 1: Nhập hàng loạt prompt, mỗi dòng một prompt. Sau đó chọn thời lượng. Có thể chọn thời lượng riêng cho mỗi prompt</p>
        <p>• LƯU Ý: Bạn nên nhập câu chuyện thay vì nhập prompt. Nên lưu ý thời lượng để phù hợp với câu chuyện.</p>
      </div>
       <div>
        <p className="font-semibold">3) Tạo video từ ảnh nhân vật</p>
        <p>• Bước 1: Thêm ảnh nhân vật, tối đa 10 nhân vật. Đặt tên nhân vật (tên &gt; 4 ký tự)</p>
        <p>• Bước 2: Nhập hàng loạt prompt, mỗi dòng một prompt. Trong prompt nhắc tên nhân vật kèm hành động, bối cảnh</p>
        <p>• LƯU Ý: Nên chọn ảnh nền trắng hoặc png ko nền.</p>
      </div>
    </div>
  </div>
);

const JobsTable: React.FC<{
  jobs: Job[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (jobId: string, checked: boolean) => void;
  onView: (jobId: string) => void;
}> = ({ jobs, onSelectAll, onSelectOne, onView }) => {
    const allSelected = jobs.length > 0 && jobs.every(job => job.selected);
    const sortedJobs = [...jobs].sort((a, b) => a.order - b.order);

  return (
    <div className="border border-gray-200 rounded-lg bg-white flex-grow flex flex-col">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="p-4">
                        <div className="flex items-center">
                            <input id="checkbox-all" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
                            checked={allSelected}
                            onChange={(e) => onSelectAll(e.target.checked)}
                            />
                            <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                        </div>
                    </th>
                    <th scope="col" className="px-3 py-3 w-12">STT</th>
                    <th scope="col" className="px-6 py-3">Trạng thái</th>
                    <th scope="col" className="px-6 py-3">Prompt</th>
                    <th scope="col" className="px-6 py-3 w-48">Tiến độ</th>
                </tr>
                </thead>
                <tbody>
                {sortedJobs.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-500">Chưa có video nào được tạo</td>
                    </tr>
                ) : (
                sortedJobs.map((job, index) => (
                    <tr key={job.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input id={`checkbox-${job.id}`} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
                                checked={!!job.selected}
                                onChange={(e) => onSelectOne(job.id, e.target.checked)}
                                />
                                <label htmlFor={`checkbox-${job.id}`} className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td className="px-3 py-4 font-medium text-gray-900">{String(index + 1).padStart(3, '0')}</td>
                        <td className="px-6 py-4">
                            {job.status === 'success' ? (
                                <button onClick={() => onView(job.id)} className="flex items-center gap-1 text-blue-600 hover:underline">
                                    <PlayIcon className="w-4 h-4" /> Xem
                                </button>
                            ) : job.status === 'error' ? (
                                <span className="text-red-500">Lỗi</span>
                            ) : (
                                <span className="text-gray-500 capitalize">{job.status}</span>
                            )}
                        </td>
                        <td className="px-6 py-4 truncate max-w-xs" title={job.params.prompt}>{job.params.prompt}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${job.progress}%` }}></div>
                                </div>
                                <span className="text-xs font-medium">{job.progress}%</span>
                            </div>
                        </td>
                    </tr>
                )))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

const Toolbar: React.FC<{
  onAction: (action: string) => void;
  hasSelection: boolean;
}> = ({ onAction, hasSelection }) => {
  const actions = [
    { id: 'join', label: 'Nối video', icon: <CombineIcon className="w-4 h-4" /> },
    { id: 'retry', label: 'Tạo lại video', icon: <ArrowPathIcon className="w-4 h-4" /> },
    { id: 'retry_failed', label: 'Tạo lại video lỗi', icon: <ArrowPathIcon className="w-4 h-4" /> },
    { id: 'crop', label: 'Cắt ảnh cuối', icon: <ScissorsIcon className="w-4 h-4" /> },
    { id: 'delete', label: 'Xóa kết quả', icon: <Trash2Icon className="w-4 h-4" /> },
    { id: 'zalo', label: 'Nhóm zalo', icon: <MessageCircleIcon className="w-4 h-4" /> },
  ];

  const isDisabled = (id: string) => {
    if (id === 'zalo') return false;
    if (id === 'retry_failed') return false; // can always try this
    return !hasSelection;
  }

  return (
    <div className="bg-white p-2 rounded-lg shadow-md flex items-center justify-start gap-2">
      {actions.map(action => (
        <button key={action.id}
          onClick={() => onAction(action.id)}
          disabled={isDisabled(action.id)}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            ${action.id === 'delete' ? 'text-red-600 bg-red-50 hover:bg-red-100' : ''}
            ${action.id === 'crop' ? 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100' : ''}
            ${action.id !== 'delete' && action.id !== 'crop' ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' : ''}
          `}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  let jobOrderCounter = useRef(0);
  const [prompts, setPrompts] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT);
  const [resolution, setResolution] = useState<Resolution>(Resolution.P1080);
  const [duration, setDuration] = useState<string>('8');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.TEXT_TO_VIDEO);
  
  // States for different modes
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [startImageFiles, setStartImageFiles] = useState<ImageFile[]>([]);
  const [endImageFiles, setEndImageFiles] = useState<ImageFile[]>([]);
  const [characterImages, setCharacterImages] = useState<{ id: string; name: string; image: ImageFile }[]>([]);
  
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        try {
          if (!(await window.aistudio.hasSelectedApiKey())) {
            setShowApiKeyDialog(true);
          }
        } catch (error) {
          setShowApiKeyDialog(true);
        }
      }
    };
    checkApiKey();
  }, []);

  const processJobsQueue = useCallback(async (jobsToProcess: Job[]) => {
    setIsGenerating(true);
    for (const job of jobsToProcess) {
      setJobs(prev => prev.map(j => j.id === job.id ? {...j, status: 'loading'} : j));
      try {
        const onProgress = (message: string, progress: number) => {
           setJobs(prev => prev.map(j => j.id === job.id ? {...j, progress} : j));
        };
        const {objectUrl, blob} = await generateVideo({...job.params, onProgress});
        setJobs(prev => prev.map(j => j.id === job.id ? {...j, status: 'success', videoUrl: objectUrl, blob, progress: 100} : j));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setJobs(prev => prev.map(j => j.id === job.id ? {...j, status: 'error', errorMessage} : j));
      }
    }
    setIsGenerating(false);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      setShowApiKeyDialog(true);
      return;
    }

    const promptList = prompts.split('\n').map(p => p.trim()).filter(Boolean);
    let newJobs: Job[] = [];

    switch (mode) {
      case GenerationMode.TEXT_TO_VIDEO:
        if (promptList.length === 0) return;
        newJobs = promptList.map(prompt => ({
          id: self.crypto.randomUUID(),
          order: jobOrderCounter.current++,
          params: { prompt, model: VeoModel.VEO_FAST, aspectRatio, resolution, mode },
          status: 'queued',
          progress: 0,
          selected: false,
        }));
        break;
      
      case GenerationMode.IMAGE_TO_VIDEO:
        if (imageFiles.length === 0) return;
        newJobs = imageFiles.map((imageFile, index) => ({
            id: self.crypto.randomUUID(),
            order: jobOrderCounter.current++,
            params: {
              prompt: promptList[index] || '',
              model: VeoModel.VEO_FAST,
              aspectRatio,
              resolution,
              mode,
              startFrame: imageFile,
            },
            status: 'queued',
            progress: 0,
            selected: false,
        }));
        break;

      case GenerationMode.FRAMES_TO_VIDEO:
        if (startImageFiles.length === 0) return;
        newJobs = startImageFiles.map((startFile, index) => ({
             id: self.crypto.randomUUID(),
             order: jobOrderCounter.current++,
             params: {
                prompt: promptList[index] || '',
                model: VeoModel.VEO_FAST,
                aspectRatio,
                resolution,
                mode,
                startFrame: startFile,
                endFrame: endImageFiles[index] || null,
             },
             status: 'queued',
             progress: 0,
             selected: false,
        }));
        break;
      
      case GenerationMode.CHARACTER_SYNC:
        if (promptList.length === 0 || characterImages.length === 0) return;
        newJobs = promptList.map(prompt => ({
          id: self.crypto.randomUUID(),
          order: jobOrderCounter.current++,
          params: {
             prompt,
             model: VeoModel.VEO,
             aspectRatio: AspectRatio.LANDSCAPE,
             resolution: Resolution.P720,
             mode,
             referenceImages: characterImages.map(ci => ci.image),
          },
          status: 'queued',
          progress: 0,
          selected: false,
        }));
        break;
    }

    if (newJobs.length > 0) {
      setJobs(prev => [...prev, ...newJobs]);
      setPrompts('');
      setImageFiles([]);
      setStartImageFiles([]);
      setEndImageFiles([]);
      processJobsQueue(newJobs);
    }
  }, [prompts, mode, aspectRatio, resolution, imageFiles, startImageFiles, endImageFiles, characterImages, processJobsQueue]);
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<ImageFile[]>>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const imageFilePromises = files.map(fileToImageFile);
            const settledImageFiles = await Promise.all(imageFilePromises);
            setter(prev => [...prev, ...settledImageFiles].sort((a,b) => a.file.name.localeCompare(b.file.name)));
        }
    };


  // Toolbar actions
  const handleToolbarAction = (action: string) => {
    const selectedIds = jobs.filter(j => j.selected).map(j => j.id);
    if(action === 'delete') {
        setJobs(prev => prev.filter(j => !selectedIds.includes(j.id)));
    } else if (action === 'retry') {
        const jobsToRetry = jobs.filter(j => selectedIds.includes(j.id));
        processJobsQueue(jobsToRetry);
    } else if (action === 'retry_failed') {
        const failedJobs = jobs.filter(j => j.status === 'error');
        processJobsQueue(failedJobs);
    } else if(action === 'zalo') {
        window.open('https://zalo.me', '_blank');
    } else {
        alert('Chức năng chưa được hỗ trợ.');
    }
  };

  const handleSelectAllJobs = (checked: boolean) => {
    setJobs(prev => prev.map(j => ({ ...j, selected: checked })));
  };

  const handleSelectOneJob = (jobId: string, checked: boolean) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, selected: checked } : j));
  };
  
  const handleViewVideo = (jobId: string) => {
      const job = jobs.find(j => j.id === jobId);
      if (job?.videoUrl) {
          window.open(job.videoUrl, '_blank');
      }
  }
  
  const getTabClassName = (tabMode: GenerationMode) =>
    `flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
      mode === tabMode
        ? 'font-semibold text-indigo-600 border-indigo-600'
        : 'text-gray-500 hover:text-indigo-600 border-transparent'
    }`;


  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {showApiKeyDialog && (
        <ApiKeyDialog onContinue={async () => {
            setShowApiKeyDialog(false);
            if(window.aistudio) await window.aistudio.openSelectKey();
        }} />
      )}
      <div className="max-w-screen-2xl mx-auto p-4 space-y-4">
        <header className="bg-white rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600">
            Veo3 Go v1.3.2 - Lưu ý: 1 Tài khoản / 1 máy (Không đổi máy được)
        </header>

        <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex items-center border-b border-gray-200 px-2">
            <button onClick={() => setMode(GenerationMode.TEXT_TO_VIDEO)} className={getTabClassName(GenerationMode.TEXT_TO_VIDEO)}>
                <TextModeIcon className="w-5 h-5" /> Text to Video
            </button>
            <button onClick={() => setMode(GenerationMode.IMAGE_TO_VIDEO)} className={getTabClassName(GenerationMode.IMAGE_TO_VIDEO)}>
                <Image className="w-5 h-5" /> Image to Video
            </button>
            <button onClick={() => setMode(GenerationMode.FRAMES_TO_VIDEO)} className={getTabClassName(GenerationMode.FRAMES_TO_VIDEO)}>
                <Layers className="w-5 h-5" /> Start-End
            </button>
            <button onClick={() => setMode(GenerationMode.CHARACTER_SYNC)} className={getTabClassName(GenerationMode.CHARACTER_SYNC)}>
                <UsersIcon className="w-5 h-5" /> Đồng bộ nhân vật
            </button>
            </div>
            
            {/* Input Panel */}
            <div className="p-4">
            {mode === GenerationMode.TEXT_TO_VIDEO && (
                <textarea
                    value={prompts}
                    onChange={(e) => setPrompts(e.target.value)}
                    placeholder={"Dán danh sách prompt vào đây\nXuống dòng sẽ tính là một prompt mới...\nNÊN DÙNG PROMPT BẰNG TIẾNG ANH\nNgười dùng miễn phí được tạo 1 prompt 1 lần"}
                    className="w-full p-3 text-sm bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition resize-y"
                    rows={8}
                />
            )}
            {mode === GenerationMode.IMAGE_TO_VIDEO && (
                <div className="space-y-4">
                    <div className="p-3 border rounded-lg bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bước 1: Chọn hàng loạt ảnh (Sẽ crop về tỷ lệ đã chọn)</label>
                        <div className="flex items-center justify-between p-2 border rounded-md bg-white">
                            <span>{imageFiles.length > 0 ? `${imageFiles.length} ảnh đã chọn` : 'Chưa chọn ảnh'}</span>
                            <label htmlFor="image-upload" className="cursor-pointer text-blue-600 hover:text-blue-800">
                                <FolderIcon className="w-6 h-6"/>
                                <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={e => handleFileSelect(e, setImageFiles)}/>
                            </label>
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Bước 2: Nhập hàng loạt prompt tương ứng</label>
                         <textarea
                            value={prompts}
                            onChange={(e) => setPrompts(e.target.value)}
                            placeholder={"- Dán hàng loạt prompt vào, mỗi dòng là 1 prompt. Tool TỰ ĐỘNG gán prompt vào ảnh theo thứ tự\n- Ảnh xếp theo alphabet, nếu tên là số thì nên đặt 001,002...đặt 1,2,3 sẽ lỗi (Tối đa 350MB ảnh)\n- KHÔNG CHẤP NHẬN ẢNH NHẠY CẢM, NGƯỜI NỔI TIẾNG, TRẺ EM, BẠO LỰC..."}
                            className="w-full p-3 text-sm bg-gray-50 border border-gray-300 rounded-md"
                            rows={4}
                        />
                    </div>
                </div>
            )}
             {mode === GenerationMode.FRAMES_TO_VIDEO && (
                <div className="space-y-4">
                     <div className="p-3 border rounded-lg bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bước 1: Chọn hàng loạt ảnh BẮT ĐẦU</label>
                        <div className="flex items-center justify-between p-2 border rounded-md bg-white">
                            <span>{startImageFiles.length > 0 ? `${startImageFiles.length} ảnh đã chọn` : 'Chưa chọn ảnh bắt đầu'}</span>
                            <label htmlFor="start-image-upload" className="cursor-pointer text-blue-600 hover:text-blue-800">
                                <FolderIcon className="w-6 h-6"/>
                                <input id="start-image-upload" type="file" multiple accept="image/*" className="hidden" onChange={e => handleFileSelect(e, setStartImageFiles)}/>
                            </label>
                        </div>
                    </div>
                    <div className="p-3 border rounded-lg bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bước 2: Chọn hàng loạt ảnh KẾT THÚC</label>
                         <div className="flex items-center justify-between p-2 border rounded-md bg-white">
                            <span>{endImageFiles.length > 0 ? `${endImageFiles.length} ảnh đã chọn` : 'Chưa chọn ảnh kết thúc'}</span>
                            <label htmlFor="end-image-upload" className="cursor-pointer text-blue-600 hover:text-blue-800">
                                <FolderIcon className="w-6 h-6"/>
                                <input id="end-image-upload" type="file" multiple accept="image/*" className="hidden" onChange={e => handleFileSelect(e, setEndImageFiles)}/>
                            </label>
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Bước 3: Nhập hàng loạt prompt tương ứng</label>
                         <textarea
                            value={prompts}
                            onChange={(e) => setPrompts(e.target.value)}
                            placeholder={"- Dán hàng loạt prompt vào, mỗi dòng là 1 prompt.\n- Tool TỰ ĐỘNG ghép cặp: ảnh_start[0] + ảnh_end[0] + prompt[0], ..."}
                            className="w-full p-3 text-sm bg-gray-50 border border-gray-300 rounded-md"
                            rows={4}
                        />
                    </div>
                </div>
             )}
              {mode === GenerationMode.CHARACTER_SYNC && (
                <div className="grid grid-cols-2 gap-4">
                    <textarea
                        value={prompts}
                        onChange={(e) => setPrompts(e.target.value)}
                        placeholder={"- Dán hàng loạt prompt, mỗi dòng 1 prompt\n- Chọn 10 ảnh nhân vật và đặt tên riêng cho nhân vật\n- Gọi tên nhân vật (chỉ tên) và mô tả hành động của nhân vật, bối cảnh.."}
                        className="w-full p-3 text-sm bg-gray-50 border border-gray-300 rounded-md"
                        rows={8}
                    />
                    <div className="p-3 border rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center">
                        <p className="font-semibold mb-2">Chọn ảnh nhân vật (tối đa 10)</p>
                        <div className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500">
                             Click để chọn ảnh
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Chức năng đang được phát triển</p>
                    </div>
                </div>
              )}
            </div>

            {/* Settings and Actions */}
             <div className="px-4 pb-4 space-y-4">
                <div className="flex items-end justify-between gap-4">
                    <div className="flex gap-4">
                        <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Tỷ lệ khung hình
                        </label>
                        <div className="p-2 bg-gray-100 border border-gray-300 rounded-md w-32">
                           <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as AspectRatio)} className="w-full bg-transparent">
                                <option value={AspectRatio.PORTRAIT}>9:16 (Dọc)</option>
                                <option value={AspectRatio.LANDSCAPE}>16:9 (Ngang)</option>
                           </select>
                        </div>
                        </div>
                        <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Thời lượng mỗi video
                        </label>
                         <div className="p-2 bg-gray-100 border border-gray-300 rounded-md w-32">
                           <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-transparent">
                               <option value="8">8 giây</option>
                               <option value="16">16 giây</option>
                           </select>
                        </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400">
                            <ZapIcon className="w-5 h-5" /> BẮT ĐẦU TẠO VIDEO
                        </button>
                        <div className="flex items-center">
                            <input type="checkbox" id="1080p" checked={resolution === Resolution.P1080} onChange={(e) => setResolution(e.target.checked ? Resolution.P1080 : Resolution.P720)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
                            <label htmlFor="1080p" className="ml-2 text-sm font-medium text-gray-900">1080p</label>
                        </div>
                        <button className="bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-600 transition-colors">
                            MUA GÓI CƯỚC
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <main className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                <Toolbar onAction={handleToolbarAction} hasSelection={jobs.some(j => j.selected)} />
                <JobsTable jobs={jobs} onSelectAll={handleSelectAllJobs} onSelectOne={handleSelectOneJob} onView={handleViewVideo}/>
            </div>
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                <Instructions />
                <AccountInfo jobCount={jobs.filter(j=>j.status === 'success').length} />
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;