import React from 'react';
import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

export interface ContactInfo {
  name: string;
  title?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  wechat?: string;
  company?: string;
  license?: string;
}

export interface ContactCardProps {
  contact: ContactInfo;
  layout?: 'horizontal' | 'vertical' | 'compact';
  showActions?: boolean;
  onPhoneClick?: (phone: string) => void;
  onEmailClick?: (email: string) => void;
  onWechatClick?: (wechat: string) => void;
  className?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  layout = 'horizontal',
  showActions = true,
  onPhoneClick,
  onEmailClick,
  onWechatClick,
  className,
}) => {
  // 布局配置
  const layoutConfig = {
    horizontal: 'flex items-center gap-4',
    vertical: 'flex flex-col items-center text-center gap-4',
    compact: 'flex items-center gap-3',
  };

  const isVertical = layout === 'vertical';
  const isCompact = layout === 'compact';

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-6',
        isCompact && 'p-4',
        className
      )}
    >
      <div className={layoutConfig[layout]}>
        {/* 头像 */}
        <div className="flex-shrink-0">
          <Avatar
            src={contact.avatar}
            initials={contact.name}
            size={isCompact ? 'md' : 'xl'}
          />
        </div>

        {/* 信息区域 */}
        <div className={cn('flex-1 min-w-0', isVertical && 'text-center')}>
          {/* 姓名和职位 */}
          <div className="mb-2">
            <h3 className={cn(
              'font-semibold text-gray-900',
              isCompact ? 'text-base' : 'text-lg'
            )}>
              {contact.name}
            </h3>
            {contact.title && (
              <p className={cn(
                'text-gray-600',
                isCompact ? 'text-sm' : 'text-base'
              )}>
                {contact.title}
              </p>
            )}
          </div>

          {/* 公司信息 */}
          {contact.company && (
            <p className={cn(
              'text-gray-600 mb-2',
              isCompact ? 'text-sm' : 'text-base'
            )}>
              {contact.company}
            </p>
          )}

          {/* 资质信息 */}
          {contact.license && (
            <div className="mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {contact.license}
              </span>
            </div>
          )}

          {/* 联系方式 */}
          <div className={cn(
            'space-y-2',
            isCompact ? 'text-sm' : 'text-base'
          )}>
            {contact.phone && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600">{contact.phone}</span>
              </div>
            )}

            {contact.email && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">{contact.email}</span>
              </div>
            )}

            {contact.wechat && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.212 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c4.8 0 8.691-3.288 8.691-7.342C20.691 5.476 16.8 2.188 12 2.188zm-1.724 9.54c-.598 0-1.083-.489-1.083-1.092s.485-1.092 1.083-1.092 1.083.489 1.083 1.092-.485 1.092-1.083 1.092zm5.448 0c-.598 0-1.083-.489-1.083-1.092s.485-1.092 1.083-1.092 1.083.489 1.083 1.092-.485 1.092-1.083 1.092z"/>
                </svg>
                <span className="text-gray-600">{contact.wechat}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      {showActions && (
        <div className={cn(
          'mt-6 flex gap-3',
          isVertical ? 'justify-center' : 'justify-start',
          isCompact && 'mt-4'
        )}>
          {contact.phone && onPhoneClick && (
            <Button
              onClick={() => onPhoneClick(contact.phone!)}
              size={isCompact ? 'sm' : 'md'}
              className="flex-1 sm:flex-none"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Anrufen
            </Button>
          )}

          {contact.email && onEmailClick && (
            <Button
              variant="outline"
              onClick={() => onEmailClick(contact.email!)}
              size={isCompact ? 'sm' : 'md'}
              className="flex-1 sm:flex-none"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              E-Mail senden
            </Button>
          )}

          {contact.wechat && onWechatClick && (
            <Button
              variant="outline"
              onClick={() => onWechatClick(contact.wechat!)}
              size={isCompact ? 'sm' : 'md'}
              className="flex-1 sm:flex-none"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.212 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c4.8 0 8.691-3.288 8.691-7.342C20.691 5.476 16.8 2.188 12 2.188zm-1.724 9.54c-.598 0-1.083-.489-1.083-1.092s.485-1.092 1.083-1.092 1.083.489 1.083 1.092-.485 1.092-1.083 1.092zm5.448 0c-.598 0-1.083-.489-1.083-1.092s.485-1.092 1.083-1.092 1.083.489 1.083 1.092-.485 1.092-1.083 1.092z"/>
              </svg>
              WeChat hinzufügen
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export { ContactCard };
