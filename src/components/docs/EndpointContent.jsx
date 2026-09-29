import React, { useState, useEffect } from 'react';
import {
  LockIcon,
  CopyIcon,
  PlayIcon,
  ChevronDownIcon,
  PlusIcon
} from './DocsIcons';

function MinusIcon({ className = "w-3 h-3" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="1em" height="1em" aria-hidden="true" role="presentation" className={className}>
      <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

const autoGtmProjectResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'ProjectListResponse',
    modelDescription: "Response for listing an organization's AutoGTM projects.",
    properties: [
      {
        name: 'projects',
        type: 'array of ProjectItem',
        required: true,
        preview: '{ domain, id, daily_budget_usd }',
        copyLinkText: 'Copy link to projects',
        description: "Active projects owned by the API key's organization, newest first.",
        hasPlus: true
      },
      {
        name: 'total',
        type: 'integer',
        required: true,
        copyLinkText: 'Copy link to total',
        description: 'Number of projects returned.',
        hasPlus: false
      }
    ]
  },
  401: {
    description: 'Invalid or missing API key. Include X-API-Key header.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  402: {
    description: 'Insufficient credit balance. Every request needs a positive balance, including requests that fall entirely inside the free results zone. Top up your account.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  422: {
    description: 'Validation error. Check request body and parameters.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  429: {
    description: 'Rate limit exceeded (10000/hour), concurrent limit reached (150 per organization), or free preview quota exceeded (search requests entirely within the free results zone; the quota depends on your plan).',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  500: {
    description: 'Internal server error. Contact support if persists.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  504: {
    description: 'Request timeout. Please try again later.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  }
};

const autoGtmCampaignResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'CampaignListResponse',
    modelDescription: "Response for listing an organization's AutoGTM campaigns.",
    properties: [
      {
        name: 'campaigns',
        type: 'array of CampaignItem',
        required: true,
        preview: '{ id, project_id, status, +3 }',
        copyLinkText: 'Copy link to campaigns',
        description: "Non-archived campaigns owned by the API key's organization.",
        hasPlus: true
      },
      {
        name: 'total',
        type: 'integer',
        required: true,
        copyLinkText: 'Copy link to total',
        description: 'Number of campaigns returned.',
        hasPlus: false
      }
    ]
  },
  401: {
    description: 'Invalid or missing API key. Include X-API-Key header.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  402: {
    description: 'Insufficient credit balance. Every request needs a positive balance, including requests that fall entirely inside the free results zone. Top up your account.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  404: {
    description: 'Unknown project_id (or not your project).',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  422: {
    description: 'Validation error. Check request body and parameters.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  429: {
    description: 'Rate limit exceeded (10000/hour), concurrent limit reached (150 per organization), or free preview quota exceeded (search requests entirely within the free results zone; the quota depends on your plan).',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  500: {
    description: 'Internal server error. Contact support if persists.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  504: {
    description: 'Request timeout. Please try again later.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  }
};

const getCampaignDefinitionResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'CampaignDefinitionResponse',
    modelDescription: 'Successful Response',
    properties: []
  },
  401: {
    description: 'Invalid or missing API key. Include X-API-Key header.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  402: {
    description: 'Insufficient credit balance. Every request needs a positive balance, including requests that fall entirely inside the free results zone. Top up your account.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  404: {
    description: 'Campaign not found or not owned by your organization.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  422: {
    description: 'Validation error. Check request body and parameters.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  429: {
    description: 'Rate limit exceeded (10000/hour), concurrent limit reached (150 per organization), or free preview quota exceeded (search requests entirely within the free results zone; the quota depends on your plan).',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  500: {
    description: 'Internal server error. Contact support if persists.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  504: {
    description: 'Request timeout. Please try again later.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  }
};

const updateCampaignDefinitionResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'CampaignDefinition',
    modelDescription: 'Everything that decides who a campaign contacts and what it says — the app\'s "Campaign" tab, over the API.',
    properties: [
      {
        name: 'followups',
        type: 'CampaignFollowups',
        required: true,
        copyLinkText: 'Copy link to followups',
        description: 'How the follow-up sequence is shaped. A project-level setting: the same for every campaign of the project.',
        propertiesCount: 2,
        hasPlus: true,
        children: [
          {
            name: 'max_touches',
            type: 'integer',
            required: true,
            description: 'Emails in the sequence including the first one: 1–3.'
          },
          {
            name: 'delay_days',
            type: 'integer',
            required: false,
            nullable: true,
            description: 'Days between touches. null = Explee default.'
          }
        ]
      },
      {
        name: 'id',
        type: 'integer',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to id',
        description: 'Campaign identifier.'
      },
      {
        name: 'language',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to language',
        description: 'Language code the emails are written in; auto picks per lead.'
      },
      {
        name: 'project_id',
        type: 'integer',
        required: true,
        copyLinkText: 'Copy link to project_id',
        description: 'Project this campaign belongs to.'
      },
      {
        name: 'schedule',
        type: 'CampaignSchedule',
        required: true,
        copyLinkText: 'Copy link to schedule',
        description: 'When the campaign is allowed to send.',
        propertiesCount: 4,
        hasPlus: true,
        children: [
          {
            name: 'use_system_schedule',
            type: 'boolean',
            required: true,
            description: 'True while the days are Explee-managed; any edit of days hands ownership to you.'
          },
          {
            name: 'days',
            type: 'array of string',
            hasExample: true,
            description: "Weekdays sending is allowed on, in calendar order: mon…sun. The project's default days unless this campaign has its own."
          },
          {
            name: 'timezone',
            type: 'string',
            required: false,
            nullable: true,
            description: 'Timezone the sending window is read in. Read-only.'
          },
          {
            name: 'working_hours',
            type: 'string',
            required: false,
            nullable: true,
            description: 'Sending window inside a send day, e.g. 09:00-17:00. Read-only.'
          }
        ]
      },
      {
        name: 'status',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to status',
        description: 'Raw lifecycle status: discovery, review, outreach, listening, error, archived.'
      },
      {
        name: 'targeting_editable',
        type: 'boolean',
        required: true,
        copyLinkText: 'Copy link to targeting_editable',
        description: 'False for a campaign created from your own imported lead list: its audience is the list you uploaded, so the two SEARCH fields — target_geography and target_company_size — are locked (a write returns 409). target_role, positive_criteria and negative_criteria also shape the email copy, so they stay writable (200) and simply re-aim nothing. The offer and the email briefs stay editable either way.'
      },
      {
        name: 'customer_problem',
        type: 'string',
        required: false,
        nullable: true,
        copyLinkText: 'Copy link to customer_problem',
        description: 'The problem this audience has ("Customer problem").'
      },
      {
        name: 'daily_limit_usd',
        type: 'integer',
        required: false,
        nullable: true,
        copyLinkText: 'Copy link to daily_limit_usd',
        description: "Campaign's daily budget cap in USD."
      },
      {
        name: 'example_clients',
        type: 'array of string',
        copyLinkText: 'Copy link to example_clients',
        description: 'Recognizable companies that fit this ICP.'
      },
      {
        name: 'followup_instructions',
        type: 'string',
        hasDefault: true,
        copyLinkText: 'Copy link to followup_instructions',
        description: 'The shared brief for every follow-up in the sequence.'
      },
      {
        name: 'instructions',
        type: 'string',
        hasDefault: true,
        copyLinkText: 'Copy link to instructions',
        description: 'Your brief for the first email. Empty = briefed from the project alone.'
      },
      {
        name: 'keywords',
        type: 'string',
        required: false,
        nullable: true,
        copyLinkText: 'Copy link to keywords',
        description: 'Comma-separated search keywords. Read-only: derived by Explee from the fields above.'
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        nullable: true,
        copyLinkText: 'Copy link to name',
        description: 'Human-readable campaign name.'
      },
      {
        name: 'negative_criteria',
        type: 'array of string',
        copyLinkText: 'Copy link to negative_criteria',
        description: 'Disqualifying signals — look-alikes that are NOT a fit.'
      },
      {
        name: 'offer',
        type: 'string',
        required: false,
        nullable: true,
        copyLinkText: 'Copy link to offer',
        description: 'What you offer this audience ("What you offer" in the app).'
      },
      {
        name: 'positive_criteria',
        type: 'array of string',
        copyLinkText: 'Copy link to positive_criteria',
        description: 'Signals that qualify a company for this campaign.'
      },
      {
        name: 'reply_instructions',
        type: 'string',
        hasDefault: true,
        copyLinkText: 'Copy link to reply_instructions',
        description: 'How replies are answered. Project-level — shared by every campaign in the project, and read-only here; it is edited in the app.'
      },
      {
        name: 'status_reason',
        type: 'string',
        required: false,
        nullable: true,
        copyLinkText: 'Copy link to status_reason',
        description: 'Why a listening campaign stopped sending — user_pause, budget_pause, lead_pool_exhausted, …'
      },
      {
        name: 'target_company_size',
        type: 'string',
        required: false,
        nullable: true,
        copyLinkText: 'Copy link to target_company_size',
        description: 'Target company size, free text.'
      },
      {
        name: 'target_geography',
        type: 'string',
        required: false,
        nullable: true,
        copyLinkText: 'Copy link to target_geography',
        description: 'Target geographies, free text ("Target geography").'
      },
      {
        name: 'target_role',
        type: 'string',
        required: false,
        nullable: true,
        copyLinkText: 'Copy link to target_role',
        description: 'Who to reach at the prospect, by responsibility ("Target role").'
      },
      {
        name: 'target_url',
        type: 'string',
        required: false,
        nullable: true,
        copyLinkText: 'Copy link to target_url',
        description: 'Booking link used in the emails. Read-only here — it is gated and shared across the project.'
      }
    ]
  },
  401: {
    description: 'Invalid or missing API key. Include X-API-Key header.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  402: {
    description: 'Insufficient credit balance. Every request needs a positive balance, including requests that fall entirely inside the free results zone. Top up your account.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  404: {
    description: 'Campaign not found or not owned by your organization.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  409: {
    description: 'Targeting is locked: this campaign runs on your imported lead list.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  422: {
    description: 'Validation error. Check request body and parameters.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  429: {
    description: 'Rate limit exceeded (10000/hour), concurrent limit reached (150 per organization), or free preview quota exceeded (search requests entirely within the free results zone; the quota depends on your plan).',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  500: {
    description: 'Internal server error. Contact support if persists.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  504: {
    description: 'Request timeout. Please try again later.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  }
};

const deleteCompaniesListResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'DedupListDeleteResponse',
    modelDescription: 'Result of dropping a dedup list.',
    properties: [
      {
        name: 'deleted',
        type: 'integer',
        required: true,
        copyLinkText: 'Copy link to deleted',
        description: 'Number of values removed together with the list.',
        hasPlus: false
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        copyLinkText: 'Copy link to id',
        hasPlus: false
      },
      {
        name: 'success',
        type: 'boolean',
        required: false,
        hasDefault: true,
        copyLinkText: 'Copy link to success',
        hasPlus: false
      }
    ]
  },
  401: {
    description: 'Invalid or missing API key. Include X-API-Key header.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  402: {
    description: 'Insufficient credit balance. Every request needs a positive balance, including requests that fall entirely inside the free results zone. Top up your account.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  404: {
    description: 'Dedup list not found.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  422: {
    description: 'Validation error. Check request body and parameters.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  429: {
    description: 'Rate limit exceeded (10000/hour), concurrent limit reached (150 per organization), or free preview quota exceeded (search requests entirely within the free results zone; the quota depends on your plan).',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  500: {
    description: 'Internal server error. Contact support if persists.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  504: {
    description: 'Request timeout. Please try again later.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  }
};

const deleteCompaniesListExample = {
  success: true,
  id: "string",
  deleted: 1
};

const deletePeopleListResponses = deleteCompaniesListResponses;
const deletePeopleListExample = deleteCompaniesListExample;

const getCompaniesListResponses = {
  200: {
    description: 'Successful Response'
  },
  401: {
    description: 'Invalid or missing API key. Include X-API-Key header.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  402: {
    description: 'Insufficient credit balance. Every request needs a positive balance, including requests that fall entirely inside the free results zone. Top up your account.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  404: {
    description: 'Dedup list not found.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  422: {
    description: 'Validation error. Check request body and parameters.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  429: {
    description: 'Rate limit exceeded (10000/hour), concurrent limit reached (150 per organization), or free preview quota exceeded (search requests entirely within the free results zone; the quota depends on your plan).',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  500: {
    description: 'Internal server error. Contact support if persists.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  504: {
    description: 'Request timeout. Please try again later.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  }
};

const getCompaniesListExample = {
  success: true,
  id: "string",
  name: "string",
  total: 1,
  items: [
    "string"
  ],
  created_at: "string"
};

const getPeopleListResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'DedupListResponse',
    modelDescription: 'One dedup list with its stored values.',
    properties: [
      {
        name: 'created_at',
        type: 'string',
        required: true,
        copyLinkText: 'Copy link to created_at'
      },
      {
        name: 'id',
        type: 'string',
        required: true,
        copyLinkText: 'Copy link to id'
      },
      {
        name: 'items',
        type: 'array',
        required: true,
        copyLinkText: 'Copy link to items',
        description: 'Stored normalized identities. People lists contain identity objects and may contain legacy LinkedIn URL strings; company lists contain domains.',
        hasPlus: true,
        anyOf: [
          {
            name: 'string',
            type: 'string'
          }
        ]
      },
      {
        name: 'total',
        type: 'integer',
        required: true,
        copyLinkText: 'Copy link to total',
        description: 'Integer numbers.'
      },
      {
        name: 'name',
        type: 'string',
        nullable: true,
        copyLinkText: 'Copy link to name'
      },
      {
        name: 'success',
        type: 'boolean',
        hasDefault: true,
        copyLinkText: 'Copy link to success'
      }
    ]
  },
  401: getCompaniesListResponses[401],
  402: getCompaniesListResponses[402],
  404: getCompaniesListResponses[404],
  422: getCompaniesListResponses[422],
  429: getCompaniesListResponses[429],
  500: getCompaniesListResponses[500],
  504: getCompaniesListResponses[504]
};

const getPeopleListExample = getCompaniesListExample;

const createCompaniesListResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'DedupListCreateResponse',
    modelDescription: 'Result of creating an immutable dedup list.',
    properties: [
      {
        name: 'id',
        type: 'string',
        required: true,
        copyLinkText: 'Copy link to id',
        description: 'Pass this id in the exclude_lists search parameter.',
        hasPlus: false
      },
      {
        name: 'total',
        type: 'integer',
        required: true,
        copyLinkText: 'Copy link to total',
        description: 'Stored values after normalization and deduplication.',
        hasPlus: false
      },
      {
        name: 'invalid_count',
        type: 'integer',
        hasDefault: true,
        copyLinkText: 'Copy link to invalid_count',
        description: 'Input values that could not be parsed (not stored).',
        hasPlus: false
      },
      {
        name: 'invalid_sample',
        type: 'array',
        copyLinkText: 'Copy link to invalid_sample',
        description: 'Up to 20 unparseable input values.',
        hasPlus: false
      },
      {
        name: 'name',
        type: 'string',
        nullable: true,
        copyLinkText: 'Copy link to name',
        hasPlus: false
      },
      {
        name: 'success',
        type: 'boolean',
        hasDefault: true,
        copyLinkText: 'Copy link to success',
        hasPlus: false
      }
    ]
  },
  401: {
    description: 'Invalid or missing API key. Include X-API-Key header.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  402: {
    description: 'Insufficient credit balance. Every request needs a positive balance, including requests that fall entirely inside the free results zone. Top up your account.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  422: {
    description: 'Validation error. Check request body and parameters.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  429: {
    description: 'Rate limit exceeded (10000/hour), concurrent limit reached (150 per organization), or free preview quota exceeded (search requests entirely within the free results zone; the quota depends on your plan).',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  500: {
    description: 'Internal server error. Contact support if persists.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  504: {
    description: 'Request timeout. Please try again later.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  }
};

const createCompaniesListExample = {
  success: true,
  id: "string",
  name: "string",
  total: 1,
  invalid_count: 0,
  invalid_sample: []
};

const createPeopleListResponses = createCompaniesListResponses;
const createPeopleListExample = createCompaniesListExample;

const companiesListsResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'DedupListsResponse',
    modelDescription: 'All dedup lists of one kind for your organization.',
    properties: [
      {
        name: 'lists',
        type: 'array of DedupListSummary',
        required: true,
        preview: '{ created_at, id, total, +1 }',
        copyLinkText: 'Copy link to lists',
        propertiesCount: 4,
        children: [
          {
            name: 'created_at',
            type: 'string',
            required: true,
            copyLinkText: 'Copy link to created_at'
          },
          {
            name: 'id',
            type: 'string',
            required: true,
            copyLinkText: 'Copy link to id'
          },
          {
            name: 'name',
            type: 'string',
            nullable: true,
            copyLinkText: 'Copy link to name'
          },
          {
            name: 'total',
            type: 'integer',
            required: true,
            copyLinkText: 'Copy link to total'
          }
        ]
      },
      {
        name: 'success',
        type: 'boolean',
        hasDefault: true,
        copyLinkText: 'Copy link to success'
      }
    ]
  },
  401: {
    description: 'Invalid or missing API key. Include X-API-Key header.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  402: {
    description: 'Insufficient credit balance. Every request needs a positive balance, including requests that fall entirely inside the free results zone. Top up your account.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  422: {
    description: 'Validation error. Check request body and parameters.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  429: {
    description: 'Rate limit exceeded (10000/hour), concurrent limit reached (150 per organization), or free preview quota exceeded (search requests entirely within the free results zone; the quota depends on your plan).',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  500: {
    description: 'Internal server error. Contact support if persists.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  },
  504: {
    description: 'Request timeout. Please try again later.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        hasPlus: false
      }
    ]
  }
};

const companiesListsExample = {
  success: true,
  lists: [
    {
      id: "string",
      name: "string",
      total: 1,
      created_at: "string"
    }
  ]
};

const peopleListsResponses = companiesListsResponses;
const peopleListsExample = companiesListsExample;

const feedbackResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'FeedbackResponse',
    properties: [
      {
        name: 'received',
        type: 'boolean',
        required: true,
        copyLinkText: 'Copy link to received',
        hasPlus: false
      }
    ]
  },
  401: companiesListsResponses[401],
  422: companiesListsResponses[422],
  429: companiesListsResponses[429],
  500: companiesListsResponses[500],
  504: companiesListsResponses[504]
};

const feedbackExample = {
  received: true
};

const balanceResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'BalanceResponse',
    properties: [
      {
        name: 'remain',
        type: 'integer',
        required: true,
        copyLinkText: 'Copy link to remain',
        description: 'Integer numbers.',
        hasPlus: false
      }
    ]
  },
  401: companiesListsResponses[401],
  402: companiesListsResponses[402],
  422: companiesListsResponses[422],
  429: companiesListsResponses[429],
  500: companiesListsResponses[500],
  504: companiesListsResponses[504]
};

const balanceExample = {
  remain: 1
};

const tasksResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'TaskListResponse',
    modelDescription: 'Response for listing tasks.',
    properties: [
      {
        name: 'tasks',
        type: 'array of TaskItem',
        required: true,
        copyLinkText: 'Copy link to tasks',
        description: 'List of tasks',
        propertiesCount: 5,
        childModelDescription: 'Single task in list response.',
        hasPlus: true,
        children: [
          {
            name: 'created_at',
            type: 'string · Format: date-time',
            required: true,
            description: 'When the task was created'
          },
          {
            name: 'result_url',
            type: 'string',
            required: true,
            hasExample: true,
            description: 'Full URL to fetch task results'
          },
          {
            name: 'status',
            type: '"pending" or "completed" or "failed" · enum',
            required: true,
            description: 'Current status: pending (processing), completed (results ready), failed (error occurred)'
          },
          {
            name: 'task_id',
            type: 'string',
            required: true,
            hasExample: true,
            description: 'Unique identifier for this task'
          },
          {
            name: 'credits_charged',
            type: 'number',
            nullable: true,
            description: 'Credits charged for this task. Null while pending.'
          }
        ]
      },
      {
        name: 'total',
        type: 'integer',
        required: true,
        copyLinkText: 'Copy link to total',
        description: 'Total number of tasks matching the filter (for pagination)'
      }
    ]
  },
  422: {
    description: 'Validation Error',
    modelName: 'HTTPValidationError',
    properties: [
      {
        name: 'detail',
        type: 'array of ValidationError',
        copyLinkText: 'Copy link to detail',
        propertiesCount: 3,
        hasPlus: true,
        children: [
          {
            name: 'loc',
            type: 'array',
            required: true
          },
          {
            name: 'msg',
            type: 'string',
            required: true
          },
          {
            name: 'type',
            type: 'string',
            required: true
          }
        ]
      }
    ]
  }
};

const tasksExample = {
  tasks: [
    {
      task_id: "550e8400-e29b-41d4-a716-446655440000",
      status: "pending",
      result_url: "https://api.explee.com/public/api/v1/enrich/email/batch/550e8400-e29b-41d4-a716-446655440000",
      credits_charged: 1,
      created_at: "2026-09-29T03:11:16.765Z"
    }
  ],
  total: 1
};

const agentRunStatusResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'AgentRunStatusResponse',
    properties: [
      {
        name: 'input',
        type: 'Input',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to input',
        hasPlus: false
      },
      {
        name: 'meta',
        type: 'AgentRunMeta',
        required: true,
        copyLinkText: 'Copy link to meta',
        propertiesCount: 7,
        hasPlus: true,
        children: [
          {
            name: 'run_id',
            type: 'string',
            required: true
          },
          {
            name: 'status',
            type: 'string',
            required: true
          },
          {
            name: 'created_at',
            type: 'string · Format: date-time · nullable',
            nullable: true,
            description: 'the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z'
          },
          {
            name: 'duration_ms',
            type: 'integer · nullable',
            nullable: true,
            description: 'Integer numbers.'
          },
          {
            name: 'error',
            type: 'string · nullable',
            nullable: true
          },
          {
            name: 'progress_percent',
            type: 'integer',
            hasDefault: true,
            description: 'Integer numbers.'
          },
          {
            name: 'trajectory_url',
            type: 'string · nullable',
            nullable: true
          }
        ]
      },
      {
        name: 'result',
        type: 'Result',
        nullable: true,
        hasExample: true,
        copyLinkText: 'Copy link to result',
        hasPlus: false
      }
    ]
  },
  401: companiesListsResponses[401],
  402: companiesListsResponses[402],
  422: companiesListsResponses[422],
  429: companiesListsResponses[429],
  500: companiesListsResponses[500],
  504: companiesListsResponses[504]
};

const agentRunStatusExample = {
  result: {
    name: "Stripe, Inc.",
    website: "stripe.com"
  },
  input: {
    domain: "stripe.com"
  },
  meta: {
    run_id: "string",
    status: "string",
    error: "string",
    trajectory_url: "string",
    progress_percent: 0,
    created_at: "2026-09-29T03:11:16.765Z",
    duration_ms: 1
  }
};

const startAgentRunResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'StartAgentRunResponse',
    properties: [
      {
        name: 'run_id',
        type: 'string',
        required: true,
        copyLinkText: 'Copy link to run_id'
      }
    ]
  },
  401: companiesListsResponses[401],
  402: companiesListsResponses[402],
  422: companiesListsResponses[422],
  429: companiesListsResponses[429],
  500: companiesListsResponses[500],
  504: companiesListsResponses[504]
};

const startAgentRunExample = {
  run_id: "string"
};

const runExpleeAgentResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'StartAgentRunResponse',
    properties: [
      {
        name: 'run_id',
        type: 'string',
        required: true,
        copyLinkText: 'Copy link to run_id'
      }
    ]
  },
  401: companiesListsResponses[401],
  402: companiesListsResponses[402],
  404: {
    description: 'Agent not found'
  },
  422: companiesListsResponses[422],
  429: companiesListsResponses[429],
  500: companiesListsResponses[500],
  504: companiesListsResponses[504]
};

const runExpleeAgentExample = {
  run_id: "string"
};

const listAgentsResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'ListAgentsResponse',
    properties: [
      {
        name: 'agents',
        type: 'array of AgentInfo',
        required: true,
        copyLinkText: 'Copy link to agents',
        propertiesCount: 6,
        hasPlus: true,
        children: [
          {
            name: 'category',
            type: 'string',
            required: true
          },
          {
            name: 'description',
            type: 'string',
            required: true
          },
          {
            name: 'id',
            type: 'string',
            required: true
          },
          {
            name: 'input_schema',
            type: 'Input Schema',
            required: true,
            hasExample: true,
            hasPlus: true,
            children: [
              {
                name: 'domain',
                type: 'string',
                required: true
              }
            ]
          },
          {
            name: 'name',
            type: 'string',
            required: true
          },
          {
            name: 'output_schema',
            type: 'Output Schema',
            required: true,
            hasExample: true,
            hasPlus: true,
            children: [
              {
                name: 'name',
                type: 'string',
                required: true
              }
            ]
          }
        ]
      }
    ]
  },
  401: companiesListsResponses[401],
  402: companiesListsResponses[402],
  422: companiesListsResponses[422],
  429: companiesListsResponses[429],
  500: companiesListsResponses[500],
  504: companiesListsResponses[504]
};

const listAgentsExample = {
  agents: [
    {
      id: "string",
      name: "string",
      description: "string",
      category: "string",
      input_schema: {
        properties: {
          domain: {
            type: "string"
          }
        },
        required: [
          "domain"
        ],
        type: "object"
      },
      output_schema: {
        properties: {
          name: {
            type: "string"
          }
        },
        required: [
          "name"
        ],
        type: "object"
      }
    }
  ]
};

const getCampaignDefinitionExample = {
  id: 17518,
  project_id: 1,
  name: "string",
  status: "outreach",
  status_reason: "string",
  daily_limit_usd: 1,
  target_url: "string",
  offer: "string",
  customer_problem: "string",
  target_role: "string",
  target_geography: "string",
  target_company_size: "string"
};

const findAndEnrichStatusResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'FindAndEnrichResponse',
    modelDescription: 'Status and results for a find-and-enrich job.',
    properties: [
      {
        name: 'meta',
        type: 'FindAndEnrichResponseMeta',
        required: true,
        copyLinkText: 'Copy link to meta',
        description: 'Job status, progress, error, and credits charged.',
        propertiesCount: 7,
        hasPlus: true,
        children: [
          {
            name: 'status',
            type: '"pending" or "completed" or "failed" · enum',
            required: true,
            description: 'pending (running — poll again), completed (results ready), failed (see error).'
          },
          {
            name: 'credits_charged',
            type: 'number · nullable',
            nullable: true,
            hasExample: true,
            description: 'Credits charged — only for emails found. Null while pending, populated when completed.'
          },
          {
            name: 'error',
            type: 'string · nullable',
            nullable: true,
            description: 'Error description when status is failed. Null otherwise.'
          },
          {
            name: 'excluded_total',
            type: 'integer · nullable',
            nullable: true,
            hasExample: true,
            description: 'How many candidates were skipped because they matched your exclude_lists (across both search and enrichment) — never enriched, never charged. Null when no exclude_lists were passed; populated when completed.'
          },
          {
            name: 'has_more',
            type: 'boolean · nullable',
            nullable: true,
            description: 'True if more contacts are likely available — call again with next_cursor.'
          },
          {
            name: 'next_cursor',
            type: 'string · nullable',
            nullable: true,
            description: 'Pass as cursor in the next call to fetch the next page. Null when no more results.'
          },
          {
            name: 'progress',
            type: 'FindAndEnrichProgress · nullable',
            nullable: true,
            description: 'Approximate progress. Updated while pending; 100% when completed.',
            propertiesCount: 5,
            hasPlus: true,
            children: [
              {
                name: 'attempted',
                type: 'integer',
                required: true,
                description: 'People searched + enrichment-attempted so far.'
              },
              {
                name: 'found',
                type: 'integer',
                required: true,
                description: 'Emails found so far.'
              },
              {
                name: 'progress_pct',
                type: 'integer · min: 0 · max: 100',
                required: true,
                hasExample: true,
                description: 'Approximate completion percentage (0-100).'
              },
              {
                name: 'target',
                type: 'integer',
                required: true,
                description: 'Requested number of contacts (max_contacts).'
              },
              {
                name: 'eta_seconds',
                type: 'integer · nullable',
                nullable: true,
                hasExample: true,
                description: 'Approximate seconds remaining (rough — enrichment rate varies). Null if not yet estimable.'
              }
            ]
          }
        ]
      },
      {
        name: 'contacts',
        type: 'array of FindEnrichContactOutput · nullable',
        nullable: true,
        copyLinkText: 'Copy link to contacts',
        description: 'Enriched contacts (with found emails). Null while pending, array when completed.',
        propertiesCount: 8,
        childModelDescription: 'A single enriched contact returned by find-and-enrich (only contacts with a found email are returned).',
        hasPlus: true,
        children: [
          {
            name: 'company_domain',
            type: 'string · nullable',
            nullable: true,
            description: 'Company website domain'
          },
          {
            name: 'company_name',
            type: 'string · nullable',
            nullable: true,
            description: 'Company name'
          },
          {
            name: 'email',
            type: 'string · nullable',
            nullable: true,
            hasExample: true,
            description: 'Found email address'
          },
          {
            name: 'email_status',
            type: 'string · nullable',
            nullable: true,
            description: 'Email validation status: valid, catch_all, or catch_all_valid'
          },
          {
            name: 'first_name',
            type: 'string · nullable',
            nullable: true,
            description: 'First name of the person'
          },
          {
            name: 'last_name',
            type: 'string · nullable',
            nullable: true,
            description: 'Last name of the person'
          },
          {
            name: 'linkedin_url',
            type: 'string · nullable',
            nullable: true,
            description: 'LinkedIn profile URL'
          },
          {
            name: 'title',
            type: 'string · nullable',
            nullable: true,
            hasExample: true,
            description: 'Job title'
          }
        ]
      }
    ]
  },
  401: companiesListsResponses[401],
  402: companiesListsResponses[402],
  404: {
    description: 'Job not found'
  },
  422: companiesListsResponses[422],
  429: companiesListsResponses[429],
  500: companiesListsResponses[500],
  504: companiesListsResponses[504]
};

const findAndEnrichStatusExample = {
  contacts: [
    {
      first_name: "string",
      last_name: "string",
      title: "Head of Sales",
      linkedin_url: "string",
      company_name: "string",
      company_domain: "string",
      email: "ma@x.ai",
      email_status: "string"
    }
  ],
  meta: {
    status: "pending",
    progress: {
      attempted: 1,
      found: 1,
      target: 1,
      progress_pct: 42,
      eta_seconds: 45
    },
    error: "string",
    credits_charged: 750,
    next_cursor: "string",
    has_more: true,
    excluded_total: 12
  }
};

const findAndEnrichCreateResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'FindAndEnrichCreateResponse',
    modelDescription: 'Response schema for creating a find-and-enrich async task.',
    properties: [
      {
        name: 'task_id',
        type: 'string',
        required: true,
        example: '550e8400-e29b-41d4-a716-446655440000',
        copyLinkText: 'Copy link to task_id',
        description: 'Unique job identifier. Poll the GET endpoint with this ID for progress and results.',
        hasPlus: false
      }
    ]
  },
  401: companiesListsResponses[401],
  402: {
    description: 'Insufficient credit balance. Every request needs a positive balance, including requests that fall entirely inside the free results zone. Top up your account.',
    modelName: 'HTTPValidationError',
    modelDescription: 'Payment required.',
    properties: []
  },
  422: companiesListsResponses[422],
  429: {
    description: 'Rate limit exceeded (10000/hour), concurrent limit reached (150 per organization), or free preview quota exceeded (search requests entirely within the free results zone; the quota depends on your plan).',
    modelName: 'HTTPValidationError',
    modelDescription: 'Rate limit exceeded.',
    properties: []
  },
  500: companiesListsResponses[500],
  504: companiesListsResponses[504]
};

const findAndEnrichCreateExample = {
  task_id: "550e8400-e29b-41d4-a716-446655440000"
};

const batchEmailResultsResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'BatchResponse',
    modelDescription: 'Response for batch enrichment status and results.',
    properties: [
      {
        name: 'meta',
        type: 'BatchResponseMeta',
        required: true,
        copyLinkText: 'Copy link to meta',
        description: 'Request metadata including status, error, and credits charged.',
        propertiesCount: 3,
        hasPlus: true,
        children: [
          {
            name: 'status',
            type: '"pending" or "completed" or "failed" · enum',
            required: true,
            hasExample: true,
            description: 'Current status: pending (processing), completed (results ready), failed (error occurred)'
          },
          {
            name: 'credits_charged',
            type: 'number · nullable',
            nullable: true,
            hasExample: true,
            description: 'Credits charged for this batch. Null while pending, populated when completed.'
          },
          {
            name: 'error',
            type: 'string · nullable',
            nullable: true,
            description: 'Error description when status is failed. Null otherwise.'
          }
        ]
      },
      {
        name: 'contacts',
        type: 'array of ContactOutput · nullable',
        nullable: true,
        copyLinkText: 'Copy link to contacts',
        description: 'Enriched contacts with emails. Null while pending, array when completed.',
        propertiesCount: 5,
        childModelDescription: 'Output contact from batch enrichment.',
        hasPlus: true,
        children: [
          {
            name: 'company_domain',
            type: 'string',
            required: true,
            description: 'Company website domain'
          },
          {
            name: 'first_name',
            type: 'string',
            required: true,
            description: 'First name of the person'
          },
          {
            name: 'last_name',
            type: 'string',
            required: true,
            description: 'Last name of the person'
          },
          {
            name: 'email',
            type: 'string · nullable',
            nullable: true,
            hasExample: true,
            description: 'Found email address (null if not found)'
          },
          {
            name: 'email_status',
            type: 'string · nullable',
            nullable: true,
            description: 'Email validation status: valid, catch_all, or catch_all_valid'
          }
        ]
      }
    ]
  },
  401: {
    description: 'Invalid or missing API key. Include X-API-Key header.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        description: 'Error description'
      }
    ]
  },
  402: {
    description: 'Insufficient credit balance. Every request needs a positive balance, including requests that fall entirely inside the free results zone. Top up your account.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        description: 'Error description'
      }
    ]
  },
  404: {
    description: 'Batch not found',
    modelName: null,
    modelDescription: null,
    properties: []
  },
  422: {
    description: 'Validation error. Check request body and parameters.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        description: 'Error description'
      }
    ]
  },
  429: {
    description: 'Rate limit exceeded (10000/hour), concurrent limit reached (150 per organization), or free preview quota exceeded (search requests entirely within the free results zone; the quota depends on your plan).',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        description: 'Error description'
      }
    ]
  },
  500: {
    description: 'Internal server error. Contact support if persists.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to detail',
        description: 'Error description'
      }
    ]
  },
  504: {
    description: 'Request timeout. Please try again later.',
    modelName: 'ErrorResponse',
    modelDescription: 'Standard error response.',
    properties: [
      {
        name: 'detail',
        type: 'string',
        required: true,
        hasExample: true,
        description: 'Error description'
      }
    ]
  }
};

const batchEmailResultsExample = {
  contacts: [
    {
      first_name: "string",
      last_name: "string",
      company_domain: "string",
      email: "ma@x.ai",
      email_status: "string"
    }
  ],
  meta: {
    status: "completed",
    error: "string",
    credits_charged: 7.5
  }
};

const batchEmailCreateResponses = {
  200: {
    description: 'Successful Response',
    modelName: null,
    modelDescription: null,
    properties: [
      {
        name: 'task_id',
        type: 'string',
        required: true,
        hasExample: true,
        copyLinkText: 'Copy link to task_id',
        description: 'Async task ID'
      }
    ]
  },
  401: companiesListsResponses[401],
  402: companiesListsResponses[402],
  422: companiesListsResponses[422],
  429: companiesListsResponses[429],
  500: companiesListsResponses[500],
  504: companiesListsResponses[504]
};

const batchEmailCreateExample = {
  task_id: "550e8400-e29b-41d4-a716-446655440000"
};

const enrichPhoneResponses = {
  200: {
    description: 'Successful Response',
    modelName: 'EnrichPhoneResponse',
    modelDescription: 'Response from phone enrichment endpoint.',
    properties: [
      {
        name: 'meta',
        type: 'EnrichPhoneMetadata',
        required: true,
        copyLinkText: 'Copy link to meta',
        description: 'Request metadata including credits charged',
        propertiesCount: 2,
        children: [
          {
            name: 'credits_charged',
            type: 'number',
            required: true,
            hasExample: true,
            description: 'Credits charged for this request (0 if phone not found).'
          },
          {
            name: 'remaining_balance',
            type: 'number',
            required: true,
            hasExample: true,
            description: 'Your remaining credit balance after this request.'
          }
        ]
      },
      {
        name: 'phone',
        type: 'string',
        nullable: true,
        hasExample: true,
        copyLinkText: 'Copy link to phone',
        description: 'Found phone number in E.164 format (null if not found)'
      }
    ]
  },
  401: companiesListsResponses[401],
  402: companiesListsResponses[402],
  422: companiesListsResponses[422],
  429: companiesListsResponses[429],
  500: companiesListsResponses[500],
  504: companiesListsResponses[504]
};

const enrichPhoneExample = {
  phone: "+14255551234",
  meta: {
    credits_charged: 15,
    remaining_balance: 950
  }
};

const nlToFiltersResponses = {
  200: {
    "description": "Successful Response",
    "modelName": "NlToFiltersResponse",
    "modelDescription": "Successful NL to filters response.",
    "properties": [
        {
            "name": "companies_filters",
            "type": "PublicCompaniesFilters",
            "required": true,
            "hasExample": true,
            "preview": "{ criteria, definition, definition_exclude, +46 }",
            "copyLinkText": "Copy link to companies_filters",
            "description": "Structured companies filters generated from query.",
            "propertiesCount": 49,
            "children": [
                {
                    "name": "criteria",
                    "type": "array of string \u00b7 nullable",
                    "description": "List of natural language criteria to evaluate companies against."
                },
                {
                    "name": "definition",
                    "type": "string \u00b7 nullable",
                    "description": "Semantic search query describing the ideal company."
                },
                {
                    "name": "definition_exclude",
                    "type": "string \u00b7 nullable",
                    "description": "Semantic negative query to exclude companies."
                },
                {
                    "name": "employees_by_department",
                    "type": "object \u00b7 nullable",
                    "propertiesCount": 3,
                    "description": "Target department and employee count range.",
                    "children": [
                        {
                            "name": "department",
                            "type": "string",
                            "required": true,
                            "description": "Target department name."
                        },
                        {
                            "name": "max",
                            "type": "integer \u00b7 nullable",
                            "description": "Maximum department employee count."
                        },
                        {
                            "name": "min",
                            "type": "integer \u00b7 nullable",
                            "description": "Minimum department employee count."
                        }
                    ]
                },
                {
                    "name": "employees_growth",
                    "type": "array of string \u00b7 enum \u00b7 nullable",
                    "hasExample": true,
                    "values": [
                        "high",
                        "growing",
                        "stable",
                        "declining"
                    ],
                    "description": "Employee growth trend."
                },
                {
                    "name": "founded",
                    "type": "object \u00b7 nullable",
                    "propertiesCount": 2,
                    "description": "Company founding year range.",
                    "children": [
                        {
                            "name": "max",
                            "type": "integer \u00b7 nullable",
                            "description": "Maximum founding year."
                        },
                        {
                            "name": "min",
                            "type": "integer \u00b7 nullable",
                            "description": "Minimum founding year."
                        }
                    ]
                },
                {
                    "name": "funding_last_round_date",
                    "type": "\"6_months\" or \"1_year\" or \"any\" \u00b7 enum \u00b7 nullable",
                    "hasExample": true,
                    "description": "Time elapsed since the last funding round."
                },
                {
                    "name": "funding_last_round_stage",
                    "type": "array of string \u00b7 enum \u00b7 nullable",
                    "values": [
                        "no_funding",
                        "pre_seed_seed",
                        "series_a",
                        "series_b_plus"
                    ],
                    "description": "Stage of the last funding round."
                },
                {
                    "name": "geo_city",
                    "type": "array of string \u00b7 nullable",
                    "description": "Cities to include."
                },
                {
                    "name": "geo_city_exclude",
                    "type": "array of string \u00b7 nullable",
                    "description": "Cities to exclude."
                },
                {
                    "name": "geo_countries_traffic",
                    "type": "array of string \u00b7 nullable",
                    "description": "Countries where website traffic originates."
                },
                {
                    "name": "geo_employee_distribution",
                    "type": "string \u00b7 nullable",
                    "description": "Employee geographic concentration rule, e.g. \"US >= 50%\"."
                },
                {
                    "name": "geo_employees_country_count_min",
                    "type": "integer \u00b7 nullable",
                    "description": "Minimum number of countries where employees reside."
                },
                {
                    "name": "geo_exclude",
                    "type": "array of string \u00b7 nullable",
                    "description": "Countries or regions to exclude."
                },
                {
                    "name": "geo_founders",
                    "type": "array of string \u00b7 nullable",
                    "description": "Country codes of company founders."
                },
                {
                    "name": "geo_include",
                    "type": "array of string \u00b7 nullable",
                    "description": "Country codes or regions to include."
                },
                {
                    "name": "geo_include_empty",
                    "type": "boolean \u00b7 nullable",
                    "description": "Include companies with unspecified geographic location."
                },
                {
                    "name": "geo_subdivision",
                    "type": "array of string \u00b7 nullable",
                    "description": "State, province, or subdivision codes to include (e.g. US-CA)."
                },
                {
                    "name": "geo_subdivision_exclude",
                    "type": "array of string \u00b7 nullable",
                    "description": "Subdivision codes to exclude."
                },
                {
                    "name": "has_company_phone",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company has a direct or public phone number."
                },
                {
                    "name": "has_employees_on_linkedin",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company has employees active on LinkedIn."
                },
                {
                    "name": "has_linkedin_page",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company has a valid LinkedIn organization page."
                },
                {
                    "name": "has_public_emails",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company has publicly discoverable email addresses."
                },
                {
                    "name": "hiring_is",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company currently has active job openings."
                },
                {
                    "name": "industry_nace_classes",
                    "type": "array of string \u00b7 nullable",
                    "description": "NACE industry classification codes."
                },
                {
                    "name": "industry_nace_section",
                    "type": "string \u00b7 nullable",
                    "description": "NACE industry section code."
                },
                {
                    "name": "is_ai",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company develops or leverages AI solutions."
                },
                {
                    "name": "is_alive",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company is confirmed active / in business."
                },
                {
                    "name": "is_alive_min",
                    "type": "number \u00b7 nullable",
                    "description": "Minimum liveness confidence score (0 to 1)."
                },
                {
                    "name": "is_b2b",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company operates primarily as B2B."
                },
                {
                    "name": "is_b2b_score",
                    "type": "object \u00b7 nullable",
                    "propertiesCount": 2,
                    "description": "B2B score range (0 to 1).",
                    "children": [
                        {
                            "name": "max",
                            "type": "number \u00b7 nullable",
                            "description": "Maximum B2B score."
                        },
                        {
                            "name": "min",
                            "type": "number \u00b7 nullable",
                            "description": "Minimum B2B score."
                        }
                    ]
                },
                {
                    "name": "is_digital",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company has an active digital presence."
                },
                {
                    "name": "is_merchant",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company is an e-commerce merchant or retailer."
                },
                {
                    "name": "is_saas",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company offers software as a service."
                },
                {
                    "name": "is_startup",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company is classified as a startup."
                },
                {
                    "name": "is_tech",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company operates within the tech sector."
                },
                {
                    "name": "location_customer",
                    "type": "boolean \u00b7 nullable",
                    "description": "Match customer geography."
                },
                {
                    "name": "location_hq",
                    "type": "boolean \u00b7 nullable",
                    "description": "Match headquarters location."
                },
                {
                    "name": "min_relevance",
                    "type": "number \u00b7 nullable",
                    "description": "Minimum relevance matching score between 0.0 and 1.0."
                },
                {
                    "name": "revenue_annual",
                    "type": "object \u00b7 nullable",
                    "propertiesCount": 2,
                    "description": "Estimated annual revenue range in USD.",
                    "children": [
                        {
                            "name": "max",
                            "type": "integer \u00b7 nullable",
                            "description": "Maximum revenue in USD."
                        },
                        {
                            "name": "min",
                            "type": "integer \u00b7 nullable",
                            "description": "Minimum revenue in USD."
                        }
                    ]
                },
                {
                    "name": "size",
                    "type": "object \u00b7 nullable",
                    "propertiesCount": 2,
                    "description": "Total company employee count range.",
                    "children": [
                        {
                            "name": "max",
                            "type": "integer \u00b7 nullable",
                            "description": "Maximum employee count."
                        },
                        {
                            "name": "min",
                            "type": "integer \u00b7 nullable",
                            "description": "Minimum employee count."
                        }
                    ]
                },
                {
                    "name": "size_gm_branches",
                    "type": "object \u00b7 nullable",
                    "propertiesCount": 2,
                    "description": "Number of Google Maps branch locations range.",
                    "children": [
                        {
                            "name": "max",
                            "type": "integer \u00b7 nullable",
                            "description": "Maximum branch locations."
                        },
                        {
                            "name": "min",
                            "type": "integer \u00b7 nullable",
                            "description": "Minimum branch locations."
                        }
                    ]
                },
                {
                    "name": "size_gm_reviews",
                    "type": "object \u00b7 nullable",
                    "propertiesCount": 2,
                    "description": "Number of Google Maps reviews range.",
                    "children": [
                        {
                            "name": "max",
                            "type": "integer \u00b7 nullable",
                            "description": "Maximum reviews count."
                        },
                        {
                            "name": "min",
                            "type": "integer \u00b7 nullable",
                            "description": "Minimum reviews count."
                        }
                    ]
                },
                {
                    "name": "size_on_linkedin",
                    "type": "boolean \u00b7 nullable",
                    "description": "Company employee size confirmed via LinkedIn."
                },
                {
                    "name": "technologies",
                    "type": "array of string \u00b7 nullable",
                    "description": "Technologies detected in the company's tech stack."
                },
                {
                    "name": "traffic",
                    "type": "array of string \u00b7 enum \u00b7 nullable",
                    "values": [
                        "<1K",
                        "1K-10K",
                        "10K-100K",
                        "100K-1M",
                        "1M+",
                        "unknown"
                    ],
                    "description": "Estimated monthly website visit tiers."
                },
                {
                    "name": "traffic_growth",
                    "type": "array of string \u00b7 enum \u00b7 nullable",
                    "values": [
                        "high",
                        "growing",
                        "stable",
                        "declining",
                        "unknown"
                    ],
                    "description": "Growth trend of website traffic."
                },
                {
                    "name": "traffic_max",
                    "type": "integer \u00b7 nullable",
                    "description": "Maximum monthly website visits."
                },
                {
                    "name": "traffic_min",
                    "type": "integer \u00b7 nullable",
                    "description": "Minimum monthly website visits."
                }
            ]
        },
        {
            "name": "focus",
            "type": "\"companies\" or \"people\" \u00b7 enum",
            "required": true,
            "hasExample": true,
            "copyLinkText": "Copy link to focus",
            "description": "Suggested focus area inferred from the query."
        },
        {
            "name": "people_filters",
            "type": "PublicPeopleFilters",
            "required": true,
            "hasExample": true,
            "preview": "{ criteria, followers, geo, +4 }",
            "copyLinkText": "Copy link to people_filters",
            "description": "Structured people filters generated from query.",
            "propertiesCount": 7,
            "children": [
                {
                    "name": "criteria",
                    "type": "array of string \u00b7 nullable",
                    "description": "List of natural language criteria to evaluate candidates against."
                },
                {
                    "name": "followers",
                    "type": "object \u00b7 nullable",
                    "propertiesCount": 2,
                    "hasExample": true,
                    "description": "LinkedIn follower count range for candidate.",
                    "children": [
                        {
                            "name": "max",
                            "type": "integer \u00b7 nullable",
                            "description": "Maximum follower count."
                        },
                        {
                            "name": "min",
                            "type": "integer \u00b7 nullable",
                            "description": "Minimum follower count."
                        }
                    ]
                },
                {
                    "name": "geo",
                    "type": "array of string \u00b7 nullable",
                    "description": "Geographic locations / country codes for people."
                },
                {
                    "name": "job_titles",
                    "type": "array of string \u00b7 nullable",
                    "description": "Target job titles to match."
                },
                {
                    "name": "job_titles_exclude",
                    "type": "string \u00b7 nullable",
                    "description": "Comma-separated job titles or seniority to exclude."
                },
                {
                    "name": "min_relevance",
                    "type": "number \u00b7 nullable",
                    "description": "Minimum relevance matching score between 0.0 and 1.0."
                },
                {
                    "name": "people_per_company_limit",
                    "type": "integer \u00b7 nullable",
                    "hasExample": true,
                    "description": "Maximum number of people to return per company."
                }
            ]
        },
        {
            "name": "success",
            "type": "boolean",
            "hasDefault": true,
            "hasExample": true,
            "copyLinkText": "Copy link to success",
            "description": "Always true for successful requests."
        }
    ]
},
  401: companiesListsResponses[401],
  402: companiesListsResponses[402],
  422: companiesListsResponses[422],
  429: companiesListsResponses[429],
  500: companiesListsResponses[500],
  504: companiesListsResponses[504]
};

const nlToFiltersExample = {
  "success": true,
  "focus": "companies",
  "companies_filters": {
    "definition": "electronic signature platform",
    "definition_exclude": "consulting, agency",
    "min_relevance": 0.5,
    "geo_include": [
      "US",
      "GB",
      "DE"
    ],
    "geo_exclude": [
      "CN",
      "RU"
    ],
    "geo_include_empty": false,
    "geo_subdivision": [
      "US-CA",
      "US-NY",
      "US-TX"
    ],
    "geo_city": [
      "San Francisco",
      "New York",
      "London"
    ],
    "geo_subdivision_exclude": [
      "US-CA"
    ],
    "geo_city_exclude": [
      "Los Angeles"
    ],
    "geo_founders": [
      "US",
      "IN",
      "IL"
    ],
    "location_hq": true,
    "location_customer": true,
    "founded": {
      "max": 2023,
      "min": 2015
    },
    "size": {
      "max": 500,
      "min": 50
    },
    "size_on_linkedin": true,
    "revenue_annual": {
      "max": 100000000,
      "min": 1000000
    },
    "is_b2b": true,
    "is_saas": true,
    "is_startup": true,
    "is_tech": true,
    "is_merchant": true,
    "is_digital": true,
    "is_ai": true,
    "is_alive_min": 0.7,
    "is_alive": true,
    "geo_employee_distribution": "US >= 50%",
    "geo_employees_country_count_min": 3,
    "employees_growth": [
      "high",
      "growing"
    ],
    "hiring_is": true,
    "funding_last_round_stage": [
      "series_a",
      "series_b_plus"
    ],
    "funding_last_round_date": "1_year",
    "technologies": [
      "react",
      "aws",
      "stripe"
    ],
    "traffic": [
      "100K-1M",
      "1M+"
    ],
    "traffic_min": 10000,
    "traffic_max": 1000000,
    "geo_countries_traffic": [
      "US",
      "GB"
    ],
    "traffic_growth": [
      "high",
      "growing"
    ],
    "is_b2b_score": {
      "max": 1,
      "min": 0.7
    },
    "size_gm_branches": {
      "max": 100,
      "min": 5
    },
    "size_gm_reviews": {
      "max": 10000,
      "min": 100
    },
    "employees_by_department": {
      "department": "sales",
      "max": 50,
      "min": 5
    },
    "industry_nace_section": "C",
    "industry_nace_classes": [
      "C29",
      "C25.1"
    ],
    "has_public_emails": true,
    "has_company_phone": true,
    "has_linkedin_page": true,
    "has_employees_on_linkedin": true,
    "criteria": [
      "Has enterprise customers",
      "Uses modern tech stack"
    ]
  },
  "people_filters": {
    "job_titles": [
      "Head of Sales",
      "VP Sales",
      "Chief Revenue Officer"
    ],
    "min_relevance": 0.5,
    "job_titles_exclude": "intern, assistant, junior",
    "geo": [
      "US",
      "GB",
      "DE"
    ],
    "followers": {
      "max": 50000,
      "min": 1000
    },
    "people_per_company_limit": 5,
    "criteria": [
      "Has lead generation experience",
      "Worked at Fortune 500"
    ]
  }
};

export default function EndpointContent({ endpoint, nextEndpoint, isChild = false }) {
  if (!endpoint) {
    return (
      <div className="p-12 text-center text-[#757575]">
        Select an endpoint from the sidebar.
      </div>
    );
  }

  const isAutoGtmProjects = endpoint.path === '/public/api/v1/autogtm/projects';
  const isAutoGtmCampaigns = endpoint.path === '/public/api/v1/autogtm/campaigns';
  const isGetCampaignDefinition = endpoint.path === '/public/api/v1/autogtm/campaigns/{campaign_id}' && endpoint.method === 'GET';
  const isUpdateCampaignDefinition = endpoint.path === '/public/api/v1/autogtm/campaigns/{campaign_id}' && endpoint.method === 'PATCH';
  const isDeleteCompaniesList = endpoint.path === '/public/api/v1/dedup/companies/{list_id}' && (endpoint.method === 'DELETE' || endpoint.method === 'DEL');
  const isDeletePeopleList = endpoint.path === '/public/api/v1/dedup/people/{list_id}' && (endpoint.method === 'DELETE' || endpoint.method === 'DEL');
  const isGetPeopleList = endpoint.path === '/public/api/v1/dedup/people/{list_id}' && endpoint.method === 'GET';
  const isGetCompaniesList = endpoint.path === '/public/api/v1/dedup/companies/{list_id}' && endpoint.method === 'GET';
  const isCreateCompaniesList = endpoint.path === '/public/api/v1/dedup/companies' && endpoint.method === 'POST';
  const isCreatePeopleList = endpoint.path === '/public/api/v1/dedup/people' && endpoint.method === 'POST';
  const isCompaniesLists = endpoint.path === '/public/api/v1/dedup/companies' && endpoint.method === 'GET';
  const isPeopleLists = endpoint.path === '/public/api/v1/dedup/people' && endpoint.method === 'GET';
  const isFeedback = endpoint.path === '/public/api/v1/feedback' && endpoint.method === 'POST';
  const isGetBalance = endpoint.path === '/public/api/v1/billing/balance' && endpoint.method === 'GET';
  const isListAsyncTasks = endpoint.path === '/public/api/v1/tasks' && endpoint.method === 'GET';
  const isGetAgentRunStatus = endpoint.path === '/public/api/v1/agents/runs/{run_id}' && endpoint.method === 'GET';
  const isRunCustomAgent = endpoint.path === '/public/api/v1/agents/runs' && endpoint.method === 'POST';
  const isRunExpleeAgent = endpoint.path === '/public/api/v1/agents/{agent_id}/runs' && endpoint.method === 'POST';
  const isListExpleeAgents = endpoint.path === '/public/api/v1/agents' && endpoint.method === 'GET';
  const isFindAndEnrichStatus = endpoint.path === '/public/api/v1/find-and-enrich/{task_id}' && endpoint.method === 'GET';
  const isFindAndEnrichAsync = endpoint.path === '/public/api/v1/find-and-enrich' && endpoint.method === 'POST';
  const isBatchEmailResults = endpoint.path === '/public/api/v1/enrich/email/batch/{task_id}' && endpoint.method === 'GET';
  const isBatchEmailCreate = endpoint.path === '/public/api/v1/enrich/email/batch' && endpoint.method === 'POST';
  const isEnrichPhone = endpoint.path === '/public/api/v1/enrich/phone' && endpoint.method === 'POST';
  const isNlToFilters = endpoint.path === '/public/api/v1/search/nl-to-filters' && endpoint.method === 'POST';
  const isCustomPythonRoute = isAutoGtmProjects || isAutoGtmCampaigns || isGetCampaignDefinition || isUpdateCampaignDefinition || isDeleteCompaniesList || isDeletePeopleList || isGetPeopleList || isGetCompaniesList || isCreateCompaniesList || isCreatePeopleList || isCompaniesLists || isPeopleLists || isFeedback || isGetBalance || isListAsyncTasks || isGetAgentRunStatus || isRunCustomAgent || isRunExpleeAgent || isListExpleeAgents || isFindAndEnrichStatus || isFindAndEnrichAsync || isBatchEmailResults || isBatchEmailCreate || isEnrichPhone || isNlToFilters;

  const [selectedStatus, setSelectedStatus] = useState(200);
  const [copied, setCopied] = useState(false);
  const [showSchema, setShowSchema] = useState(false);

  // Parent responses accordion state: status -> boolean
  const [expandedResponses, setExpandedResponses] = useState(() => {
    if (isGetCompaniesList || isCreateCompaniesList || isCreatePeopleList || isCompaniesLists || isPeopleLists || isDeletePeopleList || isGetPeopleList || isFeedback || isGetBalance || isListAsyncTasks || isGetAgentRunStatus || isRunCustomAgent || isRunExpleeAgent || isListExpleeAgents || isFindAndEnrichStatus || isFindAndEnrichAsync || isBatchEmailResults || isBatchEmailCreate || isEnrichPhone || isNlToFilters) {
      return {};
    }
    if (isAutoGtmProjects || isAutoGtmCampaigns || isDeleteCompaniesList) {
      return { 200: true };
    }
    return {};
  });

  // Second-level nested accordion state: propertyPath -> boolean (e.g. "200.followups")
  const [nestedExpanded, setNestedExpanded] = useState(() => {
    if (isCreatePeopleList) {
      return { 'body.people': true };
    }
    return {};
  });

  // Reset accordion states when route changes
  useEffect(() => {
    setSelectedStatus(200);
    if (isGetCompaniesList || isCreateCompaniesList || isCreatePeopleList || isCompaniesLists || isPeopleLists || isDeletePeopleList || isGetPeopleList || isFeedback || isGetBalance || isListAsyncTasks || isGetAgentRunStatus || isRunCustomAgent || isRunExpleeAgent || isListExpleeAgents || isFindAndEnrichStatus || isFindAndEnrichAsync || isBatchEmailResults || isBatchEmailCreate || isEnrichPhone || isNlToFilters) {
      setExpandedResponses({});
    } else if (isDeleteCompaniesList) {
      setExpandedResponses({ 200: true });
    } else if (endpoint.path === '/public/api/v1/autogtm/projects' || endpoint.path === '/public/api/v1/autogtm/campaigns') {
      setExpandedResponses({ 200: true });
    } else {
      setExpandedResponses({});
    }
    if (isCreatePeopleList) {
      setNestedExpanded({ 'body.people': true });
    } else {
      setNestedExpanded({});
    }
  }, [endpoint.path, endpoint.method]);

  const methodColors = {
    GET: 'text-[#009485]',
    POST: 'text-[#009485]',
    PATCH: 'text-[#ffaa01]',
    DEL: 'text-[#d52b2a]',
    DELETE: 'text-[#d52b2a]',
  };

  // Generic status extraction and ordering
  const rawStatuses = isNlToFilters
    ? [200, 401, 402, 422, 429, 500, 504]
    : isEnrichPhone
    ? [200, 401, 402, 422, 429, 500, 504]
    : isBatchEmailCreate
    ? [200, 401, 402, 422, 429, 500, 504]
    : isBatchEmailResults
    ? [200, 401, 402, 404, 422, 429, 500, 504]
    : isFindAndEnrichAsync
    ? [200, 401, 402, 422, 429, 500, 504]
    : isFindAndEnrichStatus
    ? [200, 401, 402, 404, 422, 429, 500, 504]
    : isListExpleeAgents
    ? [200, 401, 402, 422, 429, 500, 504]
    : isRunExpleeAgent
    ? [200, 401, 402, 404, 422, 429, 500, 504]
    : isRunCustomAgent
    ? [200, 401, 402, 422, 429, 500, 504]
    : isListAsyncTasks
    ? [200, 422]
    : isGetAgentRunStatus
    ? [200, 401, 402, 422, 429, 500, 504]
    : isAutoGtmProjects
    ? [200, 401, 402, 422, 429, 500, 504]
    : isAutoGtmCampaigns
    ? [200, 401, 402, 404, 422, 429, 500, 504]
    : isGetCampaignDefinition
    ? [200, 401, 402, 404, 422, 429, 500, 504]
    : isUpdateCampaignDefinition
    ? [200, 401, 402, 404, 409, 422, 429, 500, 504]
    : isDeleteCompaniesList
    ? [200, 401, 402, 404, 422, 429, 500, 504]
    : isDeletePeopleList
    ? [200, 401, 402, 404, 422, 429, 500, 504]
    : isGetPeopleList
    ? [200, 401, 402, 404, 422, 429, 500, 504]
    : isGetCompaniesList
    ? [200, 401, 402, 404, 422, 429, 500, 504]
    : isCreateCompaniesList
    ? [200, 401, 402, 422, 429, 500, 504]
    : isCreatePeopleList
    ? [200, 401, 402, 422, 429, 500, 504]
    : isCompaniesLists
    ? [200, 401, 402, 422, 429, 500, 504]
    : isPeopleLists
    ? [200, 401, 402, 422, 429, 500, 504]
    : isFeedback
    ? [200, 401, 422, 429, 500, 504]
    : isGetBalance
    ? [200, 401, 402, 422, 429, 500, 504]
    : (endpoint.responses && endpoint.responses.length > 0
        ? endpoint.responses.map(r => r.status)
        : [200]);

  const statuses = Array.from(new Set(rawStatuses)).sort((a, b) => a - b);

  const getStatusDesc = (status) => {
    if (isNlToFilters && nlToFiltersResponses[status]) {
      return nlToFiltersResponses[status].description;
    }
    if (isEnrichPhone && enrichPhoneResponses[status]) {
      return enrichPhoneResponses[status].description;
    }
    if (isBatchEmailCreate && batchEmailCreateResponses[status]) {
      return batchEmailCreateResponses[status].description;
    }
    if (isBatchEmailResults && batchEmailResultsResponses[status]) {
      return batchEmailResultsResponses[status].description;
    }
    if (isFindAndEnrichAsync && findAndEnrichCreateResponses[status]) {
      return findAndEnrichCreateResponses[status].description;
    }
    if (isFindAndEnrichStatus && findAndEnrichStatusResponses[status]) {
      return findAndEnrichStatusResponses[status].description;
    }
    if (isListExpleeAgents && listAgentsResponses[status]) {
      return listAgentsResponses[status].description;
    }
    if (isRunExpleeAgent && runExpleeAgentResponses[status]) {
      return runExpleeAgentResponses[status].description;
    }
    if (isRunCustomAgent && startAgentRunResponses[status]) {
      return startAgentRunResponses[status].description;
    }
    if (isGetAgentRunStatus && agentRunStatusResponses[status]) {
      return agentRunStatusResponses[status].description;
    }
    if (isListAsyncTasks && tasksResponses[status]) {
      return tasksResponses[status].description;
    }
    if (isAutoGtmProjects && autoGtmProjectResponses[status]) {
      return autoGtmProjectResponses[status].description;
    }
    if (isAutoGtmCampaigns && autoGtmCampaignResponses[status]) {
      return autoGtmCampaignResponses[status].description;
    }
    if (isGetCampaignDefinition && getCampaignDefinitionResponses[status]) {
      return getCampaignDefinitionResponses[status].description;
    }
    if (isUpdateCampaignDefinition && updateCampaignDefinitionResponses[status]) {
      return updateCampaignDefinitionResponses[status].description;
    }
    if (isDeleteCompaniesList && deleteCompaniesListResponses[status]) {
      return deleteCompaniesListResponses[status].description;
    }
    if (isDeletePeopleList && deletePeopleListResponses[status]) {
      return deletePeopleListResponses[status].description;
    }
    if (isGetPeopleList && getPeopleListResponses[status]) {
      return getPeopleListResponses[status].description;
    }
    if (isGetCompaniesList && getCompaniesListResponses[status]) {
      return getCompaniesListResponses[status].description;
    }
    if (isCreateCompaniesList && createCompaniesListResponses[status]) {
      return createCompaniesListResponses[status].description;
    }
    if (isCreatePeopleList && createPeopleListResponses[status]) {
      return createPeopleListResponses[status].description;
    }
    if (isCompaniesLists && companiesListsResponses[status]) {
      return companiesListsResponses[status].description;
    }
    if (isPeopleLists && peopleListsResponses[status]) {
      return peopleListsResponses[status].description;
    }
    if (isFeedback && feedbackResponses[status]) {
      return feedbackResponses[status].description;
    }
    if (isGetBalance && balanceResponses[status]) {
      return balanceResponses[status].description;
    }
    const matched = endpoint.responses?.find(r => r.status === status);
    return matched?.description || (status === 200 ? 'Successful Response' : 'Error response');
  };

  const getResponseDetail = (status) => {
    if (isNlToFilters && nlToFiltersResponses[status]) {
      return nlToFiltersResponses[status];
    }
    if (isEnrichPhone && enrichPhoneResponses[status]) {
      return enrichPhoneResponses[status];
    }
    if (isBatchEmailCreate && batchEmailCreateResponses[status]) {
      return batchEmailCreateResponses[status];
    }
    if (isBatchEmailResults && batchEmailResultsResponses[status]) {
      return batchEmailResultsResponses[status];
    }
    if (isFindAndEnrichAsync && findAndEnrichCreateResponses[status]) {
      return findAndEnrichCreateResponses[status];
    }
    if (isFindAndEnrichStatus && findAndEnrichStatusResponses[status]) {
      return findAndEnrichStatusResponses[status];
    }
    if (isListExpleeAgents && listAgentsResponses[status]) {
      return listAgentsResponses[status];
    }
    if (isRunExpleeAgent && runExpleeAgentResponses[status]) {
      return runExpleeAgentResponses[status];
    }
    if (isRunCustomAgent && startAgentRunResponses[status]) {
      return startAgentRunResponses[status];
    }
    if (isGetAgentRunStatus && agentRunStatusResponses[status]) {
      return agentRunStatusResponses[status];
    }
    if (isListAsyncTasks && tasksResponses[status]) {
      return tasksResponses[status];
    }
    if (isAutoGtmProjects && autoGtmProjectResponses[status]) {
      return autoGtmProjectResponses[status];
    }
    if (isAutoGtmCampaigns && autoGtmCampaignResponses[status]) {
      return autoGtmCampaignResponses[status];
    }
    if (isGetCampaignDefinition && getCampaignDefinitionResponses[status]) {
      return getCampaignDefinitionResponses[status];
    }
    if (isUpdateCampaignDefinition && updateCampaignDefinitionResponses[status]) {
      return updateCampaignDefinitionResponses[status];
    }
    if (isDeleteCompaniesList && deleteCompaniesListResponses[status]) {
      return deleteCompaniesListResponses[status];
    }
    if (isDeletePeopleList && deletePeopleListResponses[status]) {
      return deletePeopleListResponses[status];
    }
    if (isGetPeopleList && getPeopleListResponses[status]) {
      return getPeopleListResponses[status];
    }
    if (isGetCompaniesList && getCompaniesListResponses[status]) {
      return getCompaniesListResponses[status];
    }
    if (isCreateCompaniesList && createCompaniesListResponses[status]) {
      return createCompaniesListResponses[status];
    }
    if (isCreatePeopleList && createPeopleListResponses[status]) {
      return createPeopleListResponses[status];
    }
    if (isCompaniesLists && companiesListsResponses[status]) {
      return companiesListsResponses[status];
    }
    if (isPeopleLists && peopleListsResponses[status]) {
      return peopleListsResponses[status];
    }
    if (isFeedback && feedbackResponses[status]) {
      return feedbackResponses[status];
    }
    if (isGetBalance && balanceResponses[status]) {
      return balanceResponses[status];
    }
    return {
      description: getStatusDesc(status)
    };
  };

  const currentExampleResponse = isNlToFilters
    ? nlToFiltersExample
    : isEnrichPhone
    ? enrichPhoneExample
    : isBatchEmailCreate
    ? batchEmailCreateExample
    : isBatchEmailResults
    ? (selectedStatus === 404 ? { detail: "Batch not found" } : batchEmailResultsExample)
    : isFindAndEnrichAsync
    ? findAndEnrichCreateExample
    : isFindAndEnrichStatus
    ? findAndEnrichStatusExample
    : isListExpleeAgents
    ? listAgentsExample
    : isRunExpleeAgent
    ? runExpleeAgentExample
    : isRunCustomAgent
    ? startAgentRunExample
    : isGetAgentRunStatus
    ? agentRunStatusExample
    : isListAsyncTasks
    ? tasksExample
    : isGetBalance
    ? balanceExample
    : isFeedback
    ? feedbackExample
    : isPeopleLists
    ? peopleListsExample
    : isCompaniesLists
    ? companiesListsExample
    : isCreateCompaniesList
    ? createCompaniesListExample
    : isCreatePeopleList
    ? createPeopleListExample
    : isGetPeopleList
    ? getPeopleListExample
    : isGetCompaniesList
    ? getCompaniesListExample
    : isDeleteCompaniesList
    ? deleteCompaniesListExample
    : isDeletePeopleList
    ? deletePeopleListExample
    : isGetCampaignDefinition
    ? getCampaignDefinitionExample
    : endpoint.exampleResponse;

  const handleCopyCode = () => {
    const dataToCopy = selectedStatus === 200 ? currentExampleResponse : (
      isListAsyncTasks && selectedStatus === 422 ? {
        detail: [
          {
            loc: ["string", 0],
            msg: "string",
            type: "string"
          }
        ]
      } : {
        detail: getStatusDesc(selectedStatus)
      }
    );
    navigator.clipboard?.writeText(JSON.stringify(dataToCopy, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleResponse = (status) => {
    setExpandedResponses(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  const toggleNested = (key) => {
    setNestedExpanded(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Helper to format text with inline code blocks, bold markers, and strong prefixes
  const renderTextWithCode = (text) => {
    if (!text) return null;

    let strongPrefix = null;
    let mainText = text;
    const strongMatch = text.match(/^((Who it targets|What it says|When it says it|Cost):\s*)(.*)$/);
    if (strongMatch) {
      strongPrefix = strongMatch[2] + ': ';
      mainText = strongMatch[3];
    }

    // Bold formatting for key documentation phrases
    mainText = mainText.replace(/the app's Campaign tab/, "the app's **Campaign** tab");
    mainText = mainText.replace(/Re-aiming costs leads\./g, '**Re-aiming costs leads.**');
    mainText = mainText.replace(/anything a person can edit on the campaign in the app, you can edit here/g, '**anything a person can edit on the campaign in the app, you can edit here**');
    mainText = mainText.replace(/Read-only here:/g, '**Read-only here:**');
    mainText = mainText.replace(/Budget has/g, '**Budget has**');

    // Convert **bold** markdown to markers
    let formatted = mainText.replace(/\*\*(.*?)\*\*/g, '§§STRONG§§$1§§/STRONG§§');

    // Protect methods and paths
    const protectedCodes = [];
    formatted = formatted.replace(/(PATCH\s+\/[^\s,)]+|POST\s+\/[^\s,)]+|GET\s+\/[^\s,)]+)/g, (match) => {
      protectedCodes.push(match);
      return `___PROT_${protectedCodes.length - 1}___`;
    });

    // Protect existing code spans
    formatted = formatted.replace(/`([^`]+)`/g, (_match, p1) => {
      protectedCodes.push(p1);
      return `___PROT_${protectedCodes.length - 1}___`;
    });

    // Replace bullet prefix "word —" or "word -" with `word` —
    formatted = formatted.replace(/^([a-z_]+)\s*—\s*/, '`$1` — ');

    // Replace known variables/keywords with code
    formatted = formatted.replace(/\b(X-API-Key|daily_budget_usd|daily_limit_usd|project_id|campaign_id|task_id|person_id|list_name|list_id|targeting_editable|target_url|false|true|null|id|domain|name|status|offer|customer_problem|target_role|target_geography|target_company_size|positive_criteria|negative_criteria|example_clients|keywords|instructions|followup_instructions|language|reply_instructions|schedule|followups|422|409|200)\b/g, '`$1`');

    // Restore protected codes
    protectedCodes.forEach((code, idx) => {
      formatted = formatted.replace(`___PROT_${idx}___`, `\`${code}\``);
    });

    // Clean duplicate backticks
    formatted = formatted.replace(/`{2,}/g, '`');

    const parts = formatted.split(/(§§STRONG§§.*?§§\/STRONG§§|`[^`]+`)/g).map((chunk, i) => {
      if (chunk.startsWith('§§STRONG§§') && chunk.endsWith('§§/STRONG§§')) {
        const clean = chunk.replace(/^§§STRONG§§/, '').replace(/§§\/STRONG§§$/, '').replace(/`/g, '');
        return (
          <strong key={i} className="font-semibold text-[#1b1b1b]">
            {clean}
          </strong>
        );
      }
      if (chunk.startsWith('`') && chunk.endsWith('`')) {
        const clean = chunk.slice(1, -1);
        return (
          <code key={i} className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">
            {clean}
          </code>
        );
      }
      if (typeof chunk === 'string' && /https?:\/\//.test(chunk)) {
        const urlParts = chunk.split(/(https?:\/\/[^\s)]+)/g);
        return urlParts.map((sub, sIdx) => {
          if (/^https?:\/\//.test(sub)) {
            return (
              <a
                key={`${i}-${sIdx}`}
                href={sub}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#009485] hover:underline"
              >
                {sub}
              </a>
            );
          }
          return sub;
        });
      }
      return chunk;
    });

    if (strongPrefix) {
      return (
        <span>
          <strong className="font-semibold text-[#1b1b1b]">{strongPrefix}</strong>
          {parts}
        </span>
      );
    }
    return parts;
  };

  // Syntax highlight cURL line
  const renderCurlLine = (line) => {
    if (!line) return null;
    if (line.startsWith('curl ')) {
      const rest = line.slice(5);
      const hasBackslash = rest.endsWith(' \\');
      const cleanPath = hasBackslash ? rest.slice(0, -2) : rest;
      return (
        <span>
          <span className="text-[#f43f5e]">curl</span>{' '}
          <span className="text-[#38bdf8]">{cleanPath}</span>
          {hasBackslash && <span className="text-[#71717a]"> \</span>}
        </span>
      );
    }
    if (line.includes('--request')) {
      const parts = line.split('--request');
      return (
        <span>
          {parts[0]}
          <span className="text-[#a1a1aa]">--request</span>{' '}
          <span className="text-[#38bdf8]">{parts[1].trim().replace('\\', '').trim()}</span>
          {line.endsWith('\\') && <span className="text-[#71717a]"> \</span>}
        </span>
      );
    }
    if (line.includes('-H ') || line.includes('--header')) {
      const sep = line.includes('-H ') ? '-H ' : '--header';
      const parts = line.split(sep);
      return (
        <span>
          {parts[0]}
          <span className="text-[#a1a1aa]">{sep.trim()}</span>{' '}
          <span className="text-[#a3e635]">{parts[1].trim().replace('\\', '').trim()}</span>
          {line.endsWith('\\') && <span className="text-[#71717a]"> \</span>}
        </span>
      );
    }
    if (line.includes('--data')) {
      const parts = line.split('--data');
      return (
        <span>
          {parts[0]}
          <span className="text-[#a1a1aa]">--data</span>{' '}
          <span className="text-[#a3e635]">{parts[1].trim()}</span>
        </span>
      );
    }
    const jsonMatch = line.match(/^(\s*)(".*?"):(.*)$/);
    if (jsonMatch) {
      return (
        <span>
          {jsonMatch[1]}
          <span className="text-[#38bdf8]">{jsonMatch[2]}</span>:
          <span className="text-[#e4e4e7]">{jsonMatch[3]}</span>
        </span>
      );
    }
    return <span className="text-[#e4e4e7]">{line}</span>;
  };

  // Syntax highlight JSON output
  const renderFormattedJson = (obj) => {
    const jsonStr = JSON.stringify(obj, null, 2);
    return jsonStr.split('\n').map((line, idx) => {
      const keyMatch = line.match(/^(\s*)(".*?"):(.*)$/);
      if (keyMatch) {
        const [, indent, key, rest] = keyMatch;
        let valuePart = rest;
        let valColor = 'text-[#1b1b1b]';

        if (rest.includes('"')) {
          valColor = 'text-[#0a52af]'; // string blue
        } else if (/\b\d+\b/.test(rest)) {
          valColor = 'text-[#c2410c]'; // number orange
        } else if (/\b(true|false|null)\b/.test(rest)) {
          valColor = 'text-[#7c3aed]'; // boolean purple
        }

        return (
          <div key={idx} className="whitespace-pre">
            {indent}
            <span className="text-[#1b1b1b] font-medium">{key}</span>:
            <span className={valColor}>{valuePart}</span>
          </div>
        );
      }

      return (
        <div key={idx} className="whitespace-pre text-[#1b1b1b]">
          {line}
        </div>
      );
    });
  };

  const projectsPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/autogtm/projects"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 6, content: <span>&nbsp;</span> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const campaignsPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/autogtm/campaigns"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 6, content: <span>&nbsp;</span> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const getCampaignDefinitionPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/autogtm/campaigns/1"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 6, content: <span>&nbsp;</span> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const updateCampaignPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">json</span></span></> },
    { num: 3, content: <span>&nbsp;</span> },
    { num: 4, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 5, content: <span>&nbsp;</span> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">payload = json.dumps(&#123;</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"name"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">""</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"offer"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">""</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 9, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"customer_problem"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">""</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"target_role"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">""</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"target_geography"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">""</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 12, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"target_company_size"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">""</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 13, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"positive_criteria"</span><span className="text-[#f4f4f5]">: [</span></span></> },
    { num: 14, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">""</span></span></> },
    { num: 15, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;],</span></span></> },
    { num: 16, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"negative_criteria"</span><span className="text-[#f4f4f5]">: [</span></span></> },
    { num: 17, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">""</span></span></> },
    { num: 18, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;],</span></span></> },
    { num: 19, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"example_clients"</span><span className="text-[#f4f4f5]">: [</span></span></> },
    { num: 20, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">""</span></span></> },
    { num: 21, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;],</span></span></> },
    { num: 22, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"language"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">""</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 23, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"schedule"</span><span className="text-[#f4f4f5]">: &#123;</span></span></> },
    { num: 24, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"days"</span><span className="text-[#f4f4f5]">: [</span></span></> },
    { num: 25, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">""</span></span></> },
    { num: 26, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;],</span></span></> },
    { num: 27, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"use_system_schedule"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#c084fc]">True</span></span></> },
    { num: 28, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&#125;,</span></span></> },
    { num: 29, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"followups"</span><span className="text-[#f4f4f5]">: &#123;</span></span></> },
    { num: 30, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"max_touches"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#fb923c]">1</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 31, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"delay_days"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#fb923c]">1</span></span></> },
    { num: 32, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&#125;</span></span></> },
    { num: 33, content: <><span><span className="text-[#f4f4f5]">&#125;)</span></span></> },
    { num: 34, content: <span>&nbsp;</span> },
    { num: 35, content: <><span><span className="text-[#f4f4f5]">headers = &#123;</span></span></> },
    { num: 36, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">'Content-Type'</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">'application/json'</span></span></> },
    { num: 37, content: <><span><span className="text-[#f4f4f5]">&#125;</span></span></> },
    { num: 38, content: <span>&nbsp;</span> },
    { num: 39, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"PATCH"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/autogtm/campaigns/1"</span><span className="text-[#f4f4f5]">, payload, headers)</span></span></> },
    { num: 40, content: <span>&nbsp;</span> },
    { num: 41, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 42, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 43, content: <span>&nbsp;</span> },
    { num: 44, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const deleteCompaniesListPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"DELETE"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/dedup/companies/%7Blist_id%7D"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 6, content: <span>&nbsp;</span> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const getCompaniesListPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/dedup/companies/%7Blist_id%7D"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 6, content: <span>&nbsp;</span> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const createCompaniesListPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">json</span></span></> },
    { num: 3, content: <span>&nbsp;</span> },
    { num: 4, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 5, content: <span>&nbsp;</span> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">payload = json.dumps(&#123;</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"domains"</span><span className="text-[#f4f4f5]">: [</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"acme.com"</span></span></> },
    { num: 9, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;],</span></span></> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"name"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"client-x-portfolio"</span></span></> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">&#125;)</span></span></> },
    { num: 12, content: <span>&nbsp;</span> },
    { num: 13, content: <><span><span className="text-[#f4f4f5]">headers = &#123;</span></span></> },
    { num: 14, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">'Content-Type'</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">'application/json'</span></span></> },
    { num: 15, content: <><span><span className="text-[#f4f4f5]">&#125;</span></span></> },
    { num: 16, content: <span>&nbsp;</span> },
    { num: 17, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"POST"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/dedup/companies"</span><span className="text-[#f4f4f5]">, payload, headers)</span></span></> },
    { num: 18, content: <span>&nbsp;</span> },
    { num: 19, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 20, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 21, content: <span>&nbsp;</span> },
    { num: 22, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const companiesListsPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/dedup/companies"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 6, content: <span>&nbsp;</span> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const deletePeopleListPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"DELETE"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/dedup/people/%7Blist_id%7D"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 6, content: <span>&nbsp;</span> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const getPeopleListPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/dedup/people/%7Blist_id%7D"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 6, content: <span>&nbsp;</span> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const createPeopleListPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">json</span></span></> },
    { num: 3, content: <span>&nbsp;</span> },
    { num: 4, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 5, content: <span>&nbsp;</span> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">payload = json.dumps(&#123;</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"people"</span><span className="text-[#f4f4f5]">: [</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&#123;</span></span></> },
    { num: 9, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"company_domain"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"acme.com"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"email"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"jane@acme.com"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"first_name"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"Jane"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 12, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"last_name"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"Doe"</span></span></> },
    { num: 13, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&#125;</span></span></> },
    { num: 14, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;],</span></span></> },
    { num: 15, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"linkedin_urls"</span><span className="text-[#f4f4f5]">: [</span></span></> },
    { num: 16, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"https://linkedin.com/in/angel-lisinski"</span></span></> },
    { num: 17, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;],</span></span></> },
    { num: 18, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"name"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"bought-2026-06-10"</span></span></> },
    { num: 19, content: <><span><span className="text-[#f4f4f5]">&#125;)</span></span></> },
    { num: 20, content: <span>&nbsp;</span> },
    { num: 21, content: <><span><span className="text-[#f4f4f5]">headers = &#123;</span></span></> },
    { num: 22, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">'Content-Type'</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">'application/json'</span></span></> },
    { num: 23, content: <><span><span className="text-[#f4f4f5]">&#125;</span></span></> },
    { num: 24, content: <span>&nbsp;</span> },
    { num: 25, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"POST"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/dedup/people"</span><span className="text-[#f4f4f5]">, payload, headers)</span></span></> },
    { num: 26, content: <span>&nbsp;</span> },
    { num: 27, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 28, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 29, content: <span>&nbsp;</span> },
    { num: 30, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const peopleListsPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/dedup/people"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 6, content: <span>&nbsp;</span> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const feedbackPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">json</span></span></> },
    { num: 3, content: <span>&nbsp;</span> },
    { num: 4, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 5, content: <span>&nbsp;</span> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">payload = json.dumps(&#123;</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"message"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">""</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">&#125;)</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">headers = &#123;</span></span></> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">'Content-Type'</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">'application/json'</span></span></> },
    { num: 12, content: <><span><span className="text-[#f4f4f5]">&#125;</span></span></> },
    { num: 13, content: <span>&nbsp;</span> },
    { num: 14, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"POST"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/feedback"</span><span className="text-[#f4f4f5]">, payload, headers)</span></span></> },
    { num: 15, content: <span>&nbsp;</span> },
    { num: 16, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 17, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 18, content: <span>&nbsp;</span> },
    { num: 19, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const balancePythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/billing/balance"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 6, content: <span>&nbsp;</span> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const tasksPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span></span></> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"/public/api/v1/tasks?limit=20&offset=0"</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 12, content: <span>&nbsp;</span> },
    { num: 13, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const agentRunStatusPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span></span></> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"/public/api/v1/agents/runs/&#123;run_id&#125;"</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 12, content: <span>&nbsp;</span> },
    { num: 13, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const runCustomAgentPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">json</span></span></> },
    { num: 3, content: <span>&nbsp;</span> },
    { num: 4, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 5, content: <span>&nbsp;</span> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">payload = json.dumps(&#123;</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"system_prompt"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"Find the CEO, founders, and directors of the company by domain."</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"input_schema"</span><span className="text-[#f4f4f5]">: &#123;</span></span></> },
    { num: 9, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"properties"</span><span className="text-[#f4f4f5]">: &#123;</span></span></> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"domain"</span><span className="text-[#f4f4f5]">: &#123;</span></span></> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"type"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"string"</span></span></> },
    { num: 12, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;</span></span></> },
    { num: 13, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&#125;,</span></span></> },
    { num: 14, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"required"</span><span className="text-[#f4f4f5]">: [</span></span></> },
    { num: 15, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"domain"</span></span></> },
    { num: 16, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;],</span></span></> },
    { num: 17, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"type"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"object"</span></span></> },
    { num: 18, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&#125;,</span></span></> },
    { num: 19, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"output_schema"</span><span className="text-[#f4f4f5]">: &#123;</span></span></> },
    { num: 20, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"properties"</span><span className="text-[#f4f4f5]">: &#123;</span></span></> },
    { num: 21, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"name"</span><span className="text-[#f4f4f5]">: &#123;</span></span></> },
    { num: 22, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"type"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"string"</span></span></> },
    { num: 23, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;</span></span></> },
    { num: 24, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&#125;,</span></span></> },
    { num: 25, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"required"</span><span className="text-[#f4f4f5]">: [</span></span></> },
    { num: 26, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"name"</span></span></> },
    { num: 27, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;],</span></span></> },
    { num: 28, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"type"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"object"</span></span></> },
    { num: 29, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&#125;,</span></span></> },
    { num: 30, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"input_data"</span><span className="text-[#f4f4f5]">: &#123;</span></span></> },
    { num: 31, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"domain"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"stripe.com"</span></span></> },
    { num: 32, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&#125;</span></span></> },
    { num: 33, content: <><span><span className="text-[#f4f4f5]">&#125;)</span></span></> },
    { num: 34, content: <span>&nbsp;</span> },
    { num: 35, content: <><span><span className="text-[#f4f4f5]">headers = &#123;</span></span></> },
    { num: 36, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;</span><span className="text-[#38bdf8]">'Content-Type'</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">'application/json'</span></span></> },
    { num: 37, content: <><span><span className="text-[#f4f4f5]">&#125;</span></span></> },
    { num: 38, content: <span>&nbsp;</span> },
    { num: 39, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"POST"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/agents/runs"</span><span className="text-[#f4f4f5]">, payload, headers)</span></span></> },
    { num: 40, content: <span>&nbsp;</span> },
    { num: 41, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 42, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 43, content: <span>&nbsp;</span> },
    { num: 44, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const runExpleeAgentPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">json</span></span></> },
    { num: 3, content: <span>&nbsp;</span> },
    { num: 4, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 5, content: <span>&nbsp;</span> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">payload = json.dumps(&#123;</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"input_data"</span><span className="text-[#f4f4f5]">: &#123;</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"domain"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"stripe.com"</span></span></> },
    { num: 9, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&#125;</span></span></> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">&#125;)</span></span></> },
    { num: 11, content: <span>&nbsp;</span> },
    { num: 12, content: <><span><span className="text-[#f4f4f5]">headers = &#123;</span></span></> },
    { num: 13, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"Content-Type"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"application/json"</span></span></> },
    { num: 14, content: <><span><span className="text-[#f4f4f5]">&#125;</span></span></> },
    { num: 15, content: <span>&nbsp;</span> },
    { num: 16, content: <><span><span className="text-[#f4f4f5]">conn.request(</span></span></> },
    { num: 17, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#fb923c]">"POST"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 18, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"/public/api/v1/agents/&#123;agent_id&#125;/runs"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 19, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#f4f4f5]">body=payload,</span></span></> },
    { num: 20, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#f4f4f5]">headers=headers,</span></span></> },
    { num: 21, content: <><span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 22, content: <span>&nbsp;</span> },
    { num: 23, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 24, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 25, content: <span>&nbsp;</span> },
    { num: 26, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const findAndEnrichCreatePythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">json</span></span></> },
    { num: 3, content: <span>&nbsp;</span> },
    { num: 4, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 5, content: <span>&nbsp;</span> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">payload = json.dumps(&#123;</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"company_filters"</span><span className="text-[#f4f4f5]">: &#123;</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"definition"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"B2B SaaS company"</span></span></> },
    { num: 9, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&#125;,</span></span></> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"max_contacts"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#fb923c]">500</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"people_filters"</span><span className="text-[#f4f4f5]">: &#123;</span></span></> },
    { num: 12, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"geo"</span><span className="text-[#f4f4f5]">: [</span></span></> },
    { num: 13, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"US"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 14, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"GB"</span></span></> },
    { num: 15, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],</span></span></> },
    { num: 16, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"job_titles"</span><span className="text-[#f4f4f5]">: [</span></span></> },
    { num: 17, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"Head of Sales"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 18, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"VP Sales"</span></span></> },
    { num: 19, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</span></span></> },
    { num: 20, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&#125;,</span></span></> },
    { num: 21, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"preset"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"basic"</span></span></> },
    { num: 22, content: <><span><span className="text-[#f4f4f5]">&#125;)</span></span></> },
    { num: 23, content: <span>&nbsp;</span> },
    { num: 24, content: <><span><span className="text-[#f4f4f5]">headers = &#123;</span></span></> },
    { num: 25, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"Content-Type"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"application/json"</span></span></> },
    { num: 26, content: <><span><span className="text-[#f4f4f5]">&#125;</span></span></> },
    { num: 27, content: <span>&nbsp;</span> },
    { num: 28, content: <><span><span className="text-[#f4f4f5]">conn.request(</span></span></> },
    { num: 29, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#fb923c]">"POST"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 30, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"/public/api/v1/find-and-enrich"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 31, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#f4f4f5]">body=payload,</span></span></> },
    { num: 32, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#f4f4f5]">headers=headers,</span></span></> },
    { num: 33, content: <><span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 34, content: <span>&nbsp;</span> },
    { num: 35, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 36, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 37, content: <span>&nbsp;</span> },
    { num: 38, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const findAndEnrichStatusPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span></span></> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"/public/api/v1/find-and-enrich/&#123;task_id&#125;"</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 12, content: <span>&nbsp;</span> },
    { num: 13, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const listAgentsPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">, </span><span className="text-[#38bdf8]">"/public/api/v1/agents"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 6, content: <span>&nbsp;</span> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const batchEmailResultsPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <span>&nbsp;</span> },
    { num: 3, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 4, content: <span>&nbsp;</span> },
    { num: 5, content: <><span><span className="text-[#f4f4f5]">conn.request(</span></span></> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#fb923c]">"GET"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"/public/api/v1/enrich/email/batch/&#123;task_id&#125;"</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 12, content: <span>&nbsp;</span> },
    { num: 13, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const batchEmailCreatePythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">json</span></span></> },
    { num: 3, content: <span>&nbsp;</span> },
    { num: 4, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 5, content: <span>&nbsp;</span> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">payload = json.dumps(&#123;</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"contacts"</span><span className="text-[#f4f4f5]">: [</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;</span></span></> },
    { num: 9, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"company_domain"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"x.ai"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"first_name"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"Ma"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"last_name"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"Lin"</span></span></> },
    { num: 12, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;,</span></span></> },
    { num: 13, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;</span></span></> },
    { num: 14, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"company_domain"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"tesla.com"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 15, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"first_name"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"Elon"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 16, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"last_name"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"Musk"</span></span></> },
    { num: 17, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;</span></span></> },
    { num: 18, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;],</span></span></> },
    { num: 19, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"preset"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"basic"</span></span></> },
    { num: 20, content: <><span><span className="text-[#f4f4f5]">&#125;)</span></span></> },
    { num: 21, content: <span>&nbsp;</span> },
    { num: 22, content: <><span><span className="text-[#f4f4f5]">headers = &#123;</span></span></> },
    { num: 23, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"Content-Type"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"application/json"</span></span></> },
    { num: 24, content: <><span><span className="text-[#f4f4f5]">&#125;</span></span></> },
    { num: 25, content: <span>&nbsp;</span> },
    { num: 26, content: <><span><span className="text-[#f4f4f5]">conn.request(</span></span></> },
    { num: 27, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#fb923c]">"POST"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 28, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"/public/api/v1/enrich/email/batch"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 29, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#f4f4f5]">body=payload,</span></span></> },
    { num: 30, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#f4f4f5]">headers=headers,</span></span></> },
    { num: 31, content: <><span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 32, content: <span>&nbsp;</span> },
    { num: 33, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 34, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 35, content: <span>&nbsp;</span> },
    { num: 36, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const enrichPhonePythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">json</span></span></> },
    { num: 3, content: <span>&nbsp;</span> },
    { num: 4, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 5, content: <span>&nbsp;</span> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">payload = json.dumps(&#123;</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"linkedin_url"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"https://www.linkedin.com/in/satyanadella/"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"preset"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"basic_new"</span></span></> },
    { num: 9, content: <><span><span className="text-[#f4f4f5]">&#125;)</span></span></> },
    { num: 10, content: <span>&nbsp;</span> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">headers = &#123;</span></span></> },
    { num: 12, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"Content-Type"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"application/json"</span></span></> },
    { num: 13, content: <><span><span className="text-[#f4f4f5]">&#125;</span></span></> },
    { num: 14, content: <span>&nbsp;</span> },
    { num: 15, content: <><span><span className="text-[#f4f4f5]">conn.request(</span></span></> },
    { num: 16, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#fb923c]">"POST"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 17, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"/public/api/v1/enrich/phone"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 18, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#f4f4f5]">body=payload,</span></span></> },
    { num: 19, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#f4f4f5]">headers=headers,</span></span></> },
    { num: 20, content: <><span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 21, content: <span>&nbsp;</span> },
    { num: 22, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 23, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 24, content: <span>&nbsp;</span> },
    { num: 25, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

    const nlToFiltersPythonLines = [
    { num: 1, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">http.client</span></span></> },
    { num: 2, content: <><span><span className="text-[#c084fc]">import</span> <span className="text-[#f4f4f5]">json</span></span></> },
    { num: 3, content: <span>&nbsp;</span> },
    { num: 4, content: <><span><span className="text-[#f4f4f5]">conn = http.client.HTTPConnection(</span><span className="text-[#38bdf8]">"replace.me"</span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 5, content: <span>&nbsp;</span> },
    { num: 6, content: <><span><span className="text-[#f4f4f5]">payload = json.dumps(&#123;</span></span></> },
    { num: 7, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"query"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"SaaS companies using Stripe"</span></span></> },
    { num: 8, content: <><span><span className="text-[#f4f4f5]">&#125;)</span></span></> },
    { num: 9, content: <span>&nbsp;</span> },
    { num: 10, content: <><span><span className="text-[#f4f4f5]">headers = &#123;</span></span></> },
    { num: 11, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"Content-Type"</span><span className="text-[#f4f4f5]">: </span><span className="text-[#38bdf8]">"application/json"</span></span></> },
    { num: 12, content: <><span><span className="text-[#f4f4f5]">&#125;</span></span></> },
    { num: 13, content: <span>&nbsp;</span> },
    { num: 14, content: <><span><span className="text-[#f4f4f5]">conn.request(</span></span></> },
    { num: 15, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#fb923c]">"POST"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 16, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#38bdf8]">"/public/api/v1/search/nl-to-filters"</span><span className="text-[#f4f4f5]">,</span></span></> },
    { num: 17, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#f4f4f5]">body=payload,</span></span></> },
    { num: 18, content: <><span><span className="text-[#f4f4f5]">&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#f4f4f5]">headers=headers,</span></span></> },
    { num: 19, content: <><span><span className="text-[#f4f4f5]">)</span></span></> },
    { num: 20, content: <span>&nbsp;</span> },
    { num: 21, content: <><span><span className="text-[#f4f4f5]">response = conn.getresponse()</span></span></> },
    { num: 22, content: <><span><span className="text-[#f4f4f5]">print(response.read().decode())</span></span></> },
    { num: 23, content: <span>&nbsp;</span> },
    { num: 24, content: <><span><span className="text-[#f4f4f5]">conn.close()</span></span></> },
  ];

  const pythonExampleLines = isNlToFilters
    ? nlToFiltersPythonLines
    : isEnrichPhone
    ? enrichPhonePythonLines
    : isBatchEmailCreate
    ? batchEmailCreatePythonLines
    : isBatchEmailResults
    ? batchEmailResultsPythonLines
    : isFindAndEnrichAsync
    ? findAndEnrichCreatePythonLines
    : isFindAndEnrichStatus
    ? findAndEnrichStatusPythonLines
    : isListExpleeAgents
    ? listAgentsPythonLines
    : isRunExpleeAgent
    ? runExpleeAgentPythonLines
    : isRunCustomAgent
    ? runCustomAgentPythonLines
    : isGetAgentRunStatus
    ? agentRunStatusPythonLines
    : isListAsyncTasks
    ? tasksPythonLines
    : isGetBalance
    ? balancePythonLines
    : isFeedback
    ? feedbackPythonLines
    : isPeopleLists
    ? peopleListsPythonLines
    : isCreatePeopleList
    ? createPeopleListPythonLines
    : isGetPeopleList
    ? getPeopleListPythonLines
    : isDeletePeopleList
    ? deletePeopleListPythonLines
    : isCompaniesLists
    ? companiesListsPythonLines
    : isCreateCompaniesList
    ? createCompaniesListPythonLines
    : isGetCompaniesList
    ? getCompaniesListPythonLines
    : isDeleteCompaniesList
    ? deleteCompaniesListPythonLines
    : isUpdateCampaignDefinition
    ? updateCampaignPythonLines
    : isGetCampaignDefinition
    ? getCampaignDefinitionPythonLines
    : isAutoGtmCampaigns
    ? campaignsPythonLines
    : projectsPythonLines;

  const displayMethod = (endpoint.method === 'DEL' || endpoint.method === 'DELETE') ? 'DELETE' : endpoint.method;

  const curlCodeRaw = endpoint.curlCode || endpoint.curlCommand || `curl "https://api.explee.com${endpoint.path}" \\\n  -H "X-API-Key: $EXPLEE_API_KEY"`;
  const curlLines = curlCodeRaw.trim().split('\n');

  return (
    <div className={`section-container w-full pl-[90px] pr-[40px] font-['Inter',sans-serif] text-[#1b1b1b] ${isChild ? 'pt-[50px] pb-[60px] border-t border-[rgba(0,0,0,0.08)]' : ''}`}>
      <section className={`section w-[1112px] ${isChild ? 'pt-0 pb-0' : 'pt-[121px] pb-[90px]'}`}>
        {/* Top Header Grid: 500px + 48px gap + 564px */}
        <div className="grid grid-cols-[500px_564px] gap-[48px] items-center mb-6">
          <div>
            <h1 className="text-[26px] font-semibold text-[#1b1b1b] leading-[34px] tracking-tight m-0">
              {endpoint.label}
            </h1>
          </div>

          {/* Right Toolbar: Auth Required + Copy as Markdown */}
          <div className="flex items-center justify-end gap-3">
            <div className="flex items-center gap-1.5 text-[12px] text-[#1b1b1b] font-normal select-none">
              <LockIcon className="size-3 text-[#1b1b1b]" />
              <span>Auth Required</span>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(`# ${endpoint.label}\n\n${endpoint.method} ${endpoint.path}`);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[rgba(0,0,0,0.12)] bg-white hover:bg-[#fafafa] text-[12px] text-[#1b1b1b] transition-colors cursor-pointer h-7 shadow-2xs"
            >
              <CopyIcon className="size-3 text-[#1b1b1b]" />
              <span>Copy as Markdown</span>
            </button>
          </div>
        </div>

        {/* 2 Columns: 500px left, 564px right with 48px gap */}
        <div className="grid grid-cols-[500px_564px] gap-[48px] items-start">
          {/* Left Column (500px): Details & Parameters */}
          <div className="w-[500px] space-y-4">
            {/* Intro Paragraphs */}
            {isNlToFilters ? (
              <div className="text-[14px] leading-[22px] text-[#1b1b1b] space-y-4">
                <p className="m-0">
                  Convert a free-form natural language query into structured filters for companies and people search.
                </p>

                <div className="space-y-2 pt-2">
                  <h2 className="text-[20px] font-semibold text-[#1b1b1b] leading-[23px] m-0">
                    How It Works
                  </h2>
                  <p className="text-[14px] leading-[22px] text-[#1b1b1b] m-0">
                    Send any query in plain English (or another language), for example:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">"SaaS companies using Stripe"</code>
                    </li>
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">"Founders of AI startups in Germany"</code>
                    </li>
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">"B2B fintech companies in US and Canada"</code>
                    </li>
                  </ul>
                  <p className="text-[14px] leading-[22px] text-[#1b1b1b] m-0 pt-1">
                    The endpoint returns parsed filters in the same shape used by search endpoints:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">companies_filters</code>
                    </li>
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">people_filters</code>
                    </li>
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">focus</code> (<code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">companies</code> or <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">people</code>)
                    </li>
                  </ul>
                  <p className="text-[14px] leading-[22px] text-[#1b1b1b] m-0 pt-1">
                    This endpoint does not perform a search and does not charge credits.
                  </p>
                </div>
              </div>
            ) : isEnrichPhone ? (
              <div className="text-[14px] leading-[22px] text-[#1b1b1b] space-y-4">
                <p className="m-0">
                  Find the work phone number for a single person.
                </p>

                <div className="space-y-2 pt-2">
                  <h2 className="text-[20px] font-semibold text-[#1b1b1b] leading-[23px] m-0">
                    How It Works
                  </h2>
                  <p className="text-[14px] leading-[22px] text-[#1b1b1b] m-0">
                    Provide the person's LinkedIn profile URL (<code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">linkedin_url</code>) and we'll find their work phone. You can also pass a known <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">email</code> if you have one.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h2 className="text-[20px] font-semibold text-[#1b1b1b] leading-[23px] m-0">
                    Presets
                  </h2>
                  <div className="border border-[rgba(0,0,0,0.1)] rounded-[6px] overflow-hidden bg-white">
                    <table className="w-full text-left text-[14px] border-collapse">
                      <thead>
                        <tr className="border-b border-[rgba(0,0,0,0.1)] bg-white text-[14px] font-semibold text-[#1b1b1b]">
                          <th className="py-[8.5px] px-[16px] border-r border-[rgba(0,0,0,0.1)] font-semibold text-[14px]">Preset</th>
                          <th className="py-[8.5px] px-[16px] border-r border-[rgba(0,0,0,0.1)] font-semibold text-[14px]">Cost</th>
                          <th className="py-[8.5px] px-[16px] border-r border-[rgba(0,0,0,0.1)] font-semibold text-[14px]">Success Rate</th>
                          <th className="py-[8.5px] px-[16px] font-semibold text-[14px]">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[rgba(0,0,0,0.1)] text-[14px] text-[#1b1b1b]">
                          <td className="py-[8.5px] px-[16px] border-r border-[rgba(0,0,0,0.1)] font-medium"><strong>basic_new</strong></td>
                          <td className="py-[8.5px] px-[16px] border-r border-[rgba(0,0,0,0.1)]">15.0 credits</td>
                          <td className="py-[8.5px] px-[16px] border-r border-[rgba(0,0,0,0.1)]">~45%</td>
                          <td className="py-[8.5px] px-[16px]">Faster, lower-cost lookup.</td>
                        </tr>
                        <tr className="text-[14px] text-[#1b1b1b]">
                          <td className="py-[8.5px] px-[16px] border-r border-[rgba(0,0,0,0.1)] font-medium"><strong>premium</strong></td>
                          <td className="py-[8.5px] px-[16px] border-r border-[rgba(0,0,0,0.1)]">30.0 credits</td>
                          <td className="py-[8.5px] px-[16px] border-r border-[rgba(0,0,0,0.1)]">~60%</td>
                          <td className="py-[8.5px] px-[16px]">Broader, multi-source lookup. Higher hit rate.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h2 className="text-[20px] font-semibold text-[#1b1b1b] leading-[23px] m-0">
                    Pricing
                  </h2>
                  <p className="text-[14px] leading-[22px] text-[#1b1b1b] m-0">
                    You are only charged when a phone is found.
                  </p>
                  <p className="text-[14px] leading-[22px] text-[#1b1b1b] m-0">
                    Phone not found = 0 credits.
                  </p>
                </div>
              </div>
            ) : isBatchEmailCreate ? (
              <div className="text-[14px] leading-[22px] text-[#1b1b1b] space-y-4">
                <p className="m-0">
                  Find email addresses for multiple contacts in one request (async).
                </p>

                <div className="space-y-1.5">
                  <strong className="font-semibold text-[#1b1b1b]">How it works:</strong>
                  <ol className="list-decimal pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>
                      Submit up to 100 contacts with <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">first_name</code>, <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">last_name</code>, <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">company_domain</code>
                    </li>
                    <li>
                      Receive a <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">task_id</code> immediately
                    </li>
                    <li>
                      Poll GET endpoint with <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">task_id</code> to check status and retrieve results
                    </li>
                  </ol>
                </div>

                <div className="space-y-1.5">
                  <strong className="font-semibold text-[#1b1b1b]">Limits:</strong>
                  <ul className="list-disc pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>Maximum 100 contacts per batch</li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <strong className="font-semibold text-[#1b1b1b]">Pricing:</strong>
                  <ul className="list-disc pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>
                      <strong className="font-semibold text-[#1b1b1b]">basic</strong>: 1.5 credits per found email
                    </li>
                    <li>
                      <strong className="font-semibold text-[#1b1b1b]">premium</strong>: 5 credits per found email
                    </li>
                    <li>
                      Only charged for emails found (not found = 0 credits)
                    </li>
                  </ul>
                </div>
              </div>
            ) : isBatchEmailResults ? (
              <div className="text-[14px] leading-[22px] text-[#1b1b1b] space-y-4">
                <p className="m-0">
                  Check status and retrieve results for a batch request.
                </p>

                <div className="space-y-1.5">
                  <strong className="font-semibold text-[#1b1b1b]">Statuses (in meta.status):</strong>
                  <ul className="list-disc pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">pending</code> — processing in progress, poll again in a few seconds
                    </li>
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">completed</code> — results ready, <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">contacts</code> array contains enriched data
                    </li>
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">failed</code> — error occurred, see <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">meta.error</code> for details
                    </li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <strong className="font-semibold text-[#1b1b1b]">Response structure:</strong>
                  <ul className="list-disc pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">contacts</code> — null while pending, array when completed
                    </li>
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">meta.status</code> — current processing status
                    </li>
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">meta.error</code> — error description (null if no error)
                    </li>
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">meta.credits_charged</code> — credits used (only charged for found emails)
                    </li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <strong className="font-semibold text-[#1b1b1b]">Typical workflow:</strong>
                  <ol className="list-decimal pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>
                      POST to submit batch, get <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">task_id</code>
                    </li>
                    <li>
                      GET with <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">task_id</code>, check <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">meta.status</code>
                    </li>
                    <li>
                      If <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">pending</code>, wait 2-5 seconds and poll again
                    </li>
                    <li>
                      When <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">completed</code>, read <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">contacts</code> array
                    </li>
                  </ol>
                </div>
              </div>
            ) : isListAsyncTasks ? (
              <div className="text-[14px] leading-[22px] text-[#1b1b1b] space-y-4">
                <p className="m-0">
                  List all async tasks for your organization, including find-and-enrich jobs, batch email enrichments, and campaign lead imports.
                </p>

                <div className="space-y-1.5">
                  <strong className="font-semibold text-[#1b1b1b]">Use cases:</strong>
                  <ul className="list-disc pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>Track async jobs across every API key owned by the same organization</li>
                    <li>Find task IDs you may have lost</li>
                    <li>Monitor pending vs completed tasks</li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <strong className="font-semibold text-[#1b1b1b]">Response:</strong>
                  <ul className="list-disc pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">tasks</code> — array of task objects with status and result URL
                    </li>
                    <li>
                      <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">total</code> — total count for pagination
                    </li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <strong className="font-semibold text-[#1b1b1b]">Filtering:</strong>
                  <ul className="list-disc pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>
                      Use <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">status</code> parameter to filter by task status (pending, completed, failed)
                    </li>
                  </ul>
                </div>
              </div>
            ) : isFindAndEnrichAsync ? (
              <div className="text-[14px] leading-[22px] text-[#1b1b1b] space-y-4">
                <p className="m-0">
                  Search for people matching your filters and enrich their emails in a single async job.
                </p>

                <div className="space-y-1.5">
                  <strong className="font-semibold text-[#1b1b1b]">How it works:</strong>
                  <ol className="list-decimal pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>
                      Submit search filters + <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">max_contacts</code> (how many contacts with emails you want, max 500 per call)
                    </li>
                    <li>
                      Receive a <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">task_id</code> immediately
                    </li>
                    <li>
                      Poll the GET endpoint with <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">task_id</code> for progress (with <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">eta_seconds</code>) and results
                    </li>
                    <li>
                      For more than <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">max_contacts</code>, call again with the previous response's <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">next_cursor</code>.
                    </li>
                  </ol>
                </div>

                <div className="space-y-1.5">
                  <strong className="font-semibold text-[#1b1b1b]">Pricing:</strong>
                  <ul className="list-disc pl-5 space-y-1.5 m-0 text-[14px] leading-[22px]">
                    <li>
                      <strong className="font-semibold text-[#1b1b1b]">Search is free</strong> — you are never charged for people searched.
                    </li>
                    <li>
                      <strong className="font-semibold text-[#1b1b1b]">basic</strong>: 1.5 credits per found email · <strong className="font-semibold text-[#1b1b1b]">premium</strong>: 5 credits per found email.
                    </li>
                    <li>
                      You are charged ONLY for emails actually found. Worst-case credits are held up front (402 if insufficient).
                    </li>
                  </ul>
                </div>

                <p className="m-0">
                  <strong className="font-semibold text-[#1b1b1b]">Deduplication:</strong> pass <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">exclude_lists</code> to skip people you already own — they are not enriched and not charged.
                </p>
              </div>
            ) : (
              <>
                <div className="text-[14px] leading-[22px] text-[#1b1b1b] space-y-3">
                  {endpoint.introParagraphs && endpoint.introParagraphs.map((p, i) => (
                    <p key={i}>{renderTextWithCode(p)}</p>
                  ))}
                </div>

                {/* Bullets Section */}
                {endpoint.bulletItems && endpoint.bulletItems.length > 0 && (
                  <div className="space-y-2 text-[14px] leading-[22px] text-[#1b1b1b] pt-1">
                    {!(endpoint.bulletTitle === null || isFindAndEnrichStatus) && (
                      <p className="font-medium text-[#1b1b1b] m-0">{endpoint.bulletTitle || 'Response:'}</p>
                    )}
                    <ul className="list-disc pl-5 space-y-2 m-0">
                      {endpoint.bulletItems.map((b, i) => (
                        <li key={i}>{renderTextWithCode(b)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Outro Paragraphs */}
                {endpoint.outroParagraphs && endpoint.outroParagraphs.length > 0 && (
                  <div className="text-[14px] leading-[22px] text-[#1b1b1b] space-y-3 pt-1">
                    {endpoint.outroParagraphs.map((p, i) => (
                      <p key={i}>{renderTextWithCode(p)}</p>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Custom Structured Subsections if any */}
            {!isFindAndEnrichAsync && !isBatchEmailResults && !isBatchEmailCreate && !isEnrichPhone && !isNlToFilters && endpoint.sections && endpoint.sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-2 pt-2">
                <h4 className="text-[14px] font-semibold text-[#1b1b1b] m-0">
                  {sec.title}
                </h4>
                {sec.paragraphs && sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-[14px] leading-[22px] text-[#1b1b1b]">
                    {renderTextWithCode(p)}
                  </p>
                ))}
              </div>
            ))}

            {/* Path / Query Parameters Block */}
            {endpoint.parameters && endpoint.parameters.length > 0 && (() => {
              const pathParams = endpoint.parameters.filter(p => endpoint.path.includes(`{${p.name}}`));
              const queryParams = endpoint.parameters.filter(p => !endpoint.path.includes(`{${p.name}}`));
              return (
                <div className="pt-2 space-y-4">
                  {pathParams.length > 0 && (
                    <div>
                      <h3 className={`text-[16px] font-semibold text-[#1b1b1b] mb-3 ${(isGetAgentRunStatus || isRunExpleeAgent || isFindAndEnrichStatus || isBatchEmailResults) ? 'border-b border-[rgba(0,0,0,0.08)] pb-2' : ''}`}>
                        Path Parameters
                      </h3>
                      <div className="space-y-3">
                        {pathParams.map((param, i) => (
                          <div key={i} className="text-[13px]">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#1b1b1b]">
                                {param.name}
                              </span>
                              <span className="text-[12.5px] text-[#757575]">
                                {param.type}
                              </span>
                              {param.required && (
                                <span className="text-[#c2410c] text-[11.5px] font-normal">
                                  required
                                </span>
                              )}
                            </div>
                            {param.description && (
                              <p className="text-[13px] text-[#757575] mt-1 leading-normal m-0">
                                {renderTextWithCode(param.description)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {queryParams.length > 0 && (
                    <div>
                      <h3 className={`text-[16px] font-semibold text-[#1b1b1b] mb-3 ${isListAsyncTasks ? 'border-b border-[rgba(0,0,0,0.08)] pb-2' : ''}`}>
                        Query Parameters
                      </h3>
                      <div className="space-y-3">
                        {queryParams.map((param, i) => (
                          <div key={i} className="text-[13px]">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#1b1b1b]">
                                {param.name}
                              </span>
                              <span className="text-[12.5px] text-[#757575]">
                                {param.type} {param.required ? '· required' : (param.type?.includes('nullable') || param.type?.includes('Default') ? '' : '· nullable')}
                              </span>
                            </div>
                            {param.description && (
                              <p className="text-[13px] text-[#757575] mt-1 leading-normal m-0">
                                {renderTextWithCode(param.description)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Request Body Payload Section if present */}
            {endpoint.bodySchema && (
              <div className="pt-4">
                <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.08)] pb-2 mb-3">
                  <h3 className="text-[16px] font-semibold text-[#1b1b1b] m-0">
                    Body
                  </h3>
                  <span className="text-[13px] text-[#757575]">
                    · {endpoint.bodySchema.name}
                  </span>
                  {endpoint.bodySchema.required && (
                    <span className="text-[11.5px] text-[#c2410c] font-normal">
                      required
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-[#757575] bg-[#f5f5f5] px-2 py-0.5 rounded border border-[rgba(0,0,0,0.06)] ml-auto">
                    application/json
                  </span>
                </div>
                {endpoint.bodySchema.description && (
                  <p className="text-[13px] text-[#757575] mb-4 leading-relaxed">
                    {renderTextWithCode(endpoint.bodySchema.description)}
                  </p>
                )}
                <div className="space-y-4">
                  {endpoint.bodySchema.fields && endpoint.bodySchema.fields.map((field, i) => {
                    const fieldKey = `body.${field.name}`;
                    const isNestedOpen = !!nestedExpanded[fieldKey];
                    const hasNested = !!(field.children && field.children.length > 0);

                    return (
                      <div key={i} className="text-[13px] space-y-1">
                        <div
                          onClick={(e) => {
                            if (hasNested) {
                              e.stopPropagation();
                              toggleNested(fieldKey);
                            }
                          }}
                          className={`flex items-center gap-2 flex-wrap ${hasNested ? 'cursor-pointer' : ''}`}
                        >
                          {hasNested && (
                            <button
                              type="button"
                              className="text-[#757575] hover:text-[#1b1b1b] flex items-center justify-center size-3.5"
                            >
                              {isNestedOpen ? (
                                <MinusIcon className="size-3" />
                              ) : (
                                <PlusIcon className="size-3" />
                              )}
                            </button>
                          )}
                          <span className="font-mono font-bold text-[#1b1b1b]">
                            {field.name}
                          </span>
                          <span className="text-[12.5px] text-[#757575]">
                            {field.type}
                          </span>
                          {field.required && (
                            <span className="text-[#c2410c] text-[11.5px] font-normal">
                              required
                            </span>
                          )}
                          {field.nullable && !field.type?.includes('nullable') && (
                            <span className="text-[#757575] text-[11.5px] font-normal">
                              nullable
                            </span>
                          )}
                          {!isNestedOpen && field.collapsedPreview && (
                            <span className="font-mono text-[11.5px] text-[#757575] max-w-[280px] truncate">
                              {field.collapsedPreview}
                            </span>
                          )}
                          {field.example && (
                            <span className="text-[#009485] text-[12px] font-medium cursor-pointer">
                              Example
                            </span>
                          )}
                        </div>
                        {field.description && (
                          <p className={`text-[13px] text-[#757575] mt-1 leading-relaxed m-0 ${hasNested ? 'pl-5' : 'pl-0'}`}>
                            {renderTextWithCode(field.description)}
                          </p>
                        )}
                        {field.values && field.values.length > 0 && (
                          <div className={`mt-1.5 p-2 rounded border border-[rgba(0,0,0,0.08)] bg-[#fafafa] ${hasNested ? 'ml-5' : ''}`}>
                            <div className="text-[11px] font-semibold text-[#757575] uppercase tracking-wider mb-1.5">
                              Values
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {field.values.map((v, vIdx) => (
                                <span
                                  key={vIdx}
                                  className="px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.12)] bg-white text-[12px] font-mono text-[#1b1b1b]"
                                >
                                  {v}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Nested properties for bodySchema fields */}
                        {isNestedOpen && hasNested && (
                          <div className="pl-5 mt-3 space-y-4 border-l border-[rgba(0,0,0,0.08)] ml-2.5">
                            {field.propertiesCount && (
                              <div className="text-[12px] text-[#757575] font-normal">
                                Properties: {field.propertiesCount}
                              </div>
                            )}
                            {field.childModelDescription && (
                              <div className="text-[13px] text-[#757575] leading-relaxed">
                                {renderTextWithCode(field.childModelDescription)}
                              </div>
                            )}
                            {field.children.map((child, cIdx) => {
                              const childKey = `${fieldKey}.${child.name}`;
                              const isChildOpen = !!nestedExpanded[childKey];
                              const childHasNested = !!(child.children && child.children.length > 0);

                              return (
                                <div key={cIdx} className="space-y-1">
                                  <div
                                    onClick={(e) => {
                                      if (childHasNested) {
                                        e.stopPropagation();
                                        toggleNested(childKey);
                                      }
                                    }}
                                    className={`flex items-center gap-2 text-[13px] flex-wrap ${childHasNested ? 'cursor-pointer' : ''}`}
                                  >
                                    {childHasNested && (
                                      <button
                                        type="button"
                                        className="text-[#757575] hover:text-[#1b1b1b] flex items-center justify-center size-3.5"
                                      >
                                        {isChildOpen ? (
                                          <MinusIcon className="size-3" />
                                        ) : (
                                          <PlusIcon className="size-3" />
                                        )}
                                      </button>
                                    )}
                                    <span className="font-mono font-bold text-[#1b1b1b]">
                                      {child.name}
                                    </span>
                                    <span className="text-[#757575] text-[12.5px] font-normal">
                                      {child.type}
                                    </span>
                                    {child.required && (
                                      <span className="text-[#c2410c] text-[11.5px] font-normal">
                                        required
                                      </span>
                                    )}
                                    {child.nullable && !child.type?.includes('nullable') && (
                                      <span className="text-[#757575] text-[11.5px] font-normal">
                                        nullable
                                      </span>
                                    )}
                                    {!isChildOpen && child.collapsedPreview && (
                                      <span className="font-mono text-[11.5px] text-[#757575] max-w-[200px] truncate">
                                        {child.collapsedPreview}
                                      </span>
                                    )}
                                    {child.example && (
                                      <span className="text-[#009485] text-[12px] font-medium cursor-pointer">
                                        Example
                                      </span>
                                    )}
                                  </div>
                                  {child.description && (
                                    <p className={`text-[13px] text-[#757575] leading-relaxed m-0 ${childHasNested ? 'pl-5' : 'pl-0'}`}>
                                      {renderTextWithCode(child.description)}
                                    </p>
                                  )}
                                  {child.values && child.values.length > 0 && (
                                    <div className={`mt-1.5 p-2 rounded border border-[rgba(0,0,0,0.08)] bg-[#fafafa] ${childHasNested ? 'ml-5' : ''}`}>
                                      <div className="text-[11px] font-semibold text-[#757575] uppercase tracking-wider mb-1.5">
                                        Values
                                      </div>
                                      <div className="flex flex-wrap gap-1.5">
                                        {child.values.map((v, vIdx) => (
                                          <span
                                            key={vIdx}
                                            className="px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.12)] bg-white text-[12px] font-mono text-[#1b1b1b]"
                                          >
                                            {v}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {isChildOpen && childHasNested && (
                                    <div className="pl-5 mt-2 space-y-3 border-l border-[rgba(0,0,0,0.08)] ml-2.5">
                                      {child.children.map((grandChild, gIdx) => (
                                        <div key={gIdx} className="space-y-1">
                                          <div className="flex items-center gap-2 text-[13px] flex-wrap">
                                            <span className="font-mono font-bold text-[#1b1b1b]">
                                              {grandChild.name}
                                            </span>
                                            <span className="text-[#757575] text-[12.5px] font-normal">
                                              {grandChild.type}
                                            </span>
                                            {grandChild.required && (
                                              <span className="text-[#c2410c] text-[11.5px] font-normal">
                                                required
                                              </span>
                                            )}
                                            {grandChild.nullable && !grandChild.type?.includes('nullable') && (
                                              <span className="text-[#757575] text-[11.5px] font-normal">
                                                nullable
                                              </span>
                                            )}
                                          </div>
                                          {grandChild.description && (
                                            <p className="text-[13px] text-[#757575] leading-relaxed m-0">
                                              {renderTextWithCode(grandChild.description)}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Standalone Response section for Get balance */}
            {isGetBalance && (
              <div className="pt-2 space-y-3">
                <h3 className="text-[16px] font-semibold text-[#1b1b1b] m-0">
                  Response
                </h3>
                <div className="bg-[#fafafa] border border-[rgba(0,0,0,0.08)] rounded-md px-3.5 py-2.5 font-mono text-[13px] text-[#1b1b1b] overflow-x-auto">
                  <span>&#123; <span className="text-[#0a52af]">"remain"</span>: <span className="text-[#c2410c]">4200</span> &#125;</span>
                </div>
                <p className="text-[14px] leading-[22px] text-[#1b1b1b] m-0">
                  <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f2f2f2] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)] mx-0.5">remain</code> is the net balance in credits (1 credit = $0.01): prepaid funds minus any active postpaid (AutoGTM) usage that hasn't been collected yet. It can be negative if the org is carrying postpaid debt.
                </p>
              </div>
            )}

            {/* Responses Section Accordion */}
            <div className="pt-4">
              <h2 className="text-[16px] font-semibold text-[#1b1b1b] mb-4">
                Responses
              </h2>
              <div className="space-y-1">
                {statuses.map((status) => {
                  const isExpanded = !!expandedResponses[status];
                  const detail = getResponseDetail(status);

                  return (
                    <div key={status} className="border-b border-[rgba(0,0,0,0.06)] pb-2 last:border-b-0">
                      {/* Accordion Row Header */}
                      <div
                        onClick={() => toggleResponse(status)}
                        className="flex items-center justify-between py-1 cursor-pointer group hover:bg-[#fafafa] rounded px-1 -mx-1"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            className="text-[#757575] group-hover:text-[#1b1b1b] flex items-center justify-center size-3.5"
                          >
                            {isExpanded ? (
                              <MinusIcon className="size-3" />
                            ) : (
                              <PlusIcon className="size-3" />
                            )}
                          </button>
                          <span className="font-mono font-bold text-[13px] text-[#1b1b1b] shrink-0">
                            {status}
                          </span>
                          {!isExpanded && (
                            <span className="text-[13px] text-[#757575] font-normal truncate ml-1 font-sans">
                              {getStatusDesc(status)}
                            </span>
                          )}
                        </div>

                        {isExpanded && (
                          <span className="text-[11px] font-mono text-[#757575] bg-[#f5f5f5] px-2 py-0.5 rounded border border-[rgba(0,0,0,0.06)] shrink-0">
                            application/json
                          </span>
                        )}
                      </div>

                      {/* Expanded Content: Strictly rendered ONLY when isExpanded */}
                      {isExpanded && (
                        <div className="pl-5 pt-1.5 pb-2 space-y-3 font-sans">
                          <div>
                            <div className="text-[13px] text-[#757575] leading-relaxed">
                              {getStatusDesc(status)}
                            </div>
                            {detail?.modelName && (
                              <div className="text-[13px] text-[#757575] leading-relaxed font-mono mt-0.5">
                                {detail.modelName}
                              </div>
                            )}
                            {detail?.modelDescription && (
                              <div className="text-[13px] text-[#757575] leading-relaxed mt-0.5">
                                {detail.modelDescription}
                              </div>
                            )}
                          </div>

                          {detail?.properties && detail.properties.length > 0 && (
                            <div className="space-y-3 pt-2 border-t border-[rgba(0,0,0,0.06)]">
                              {detail.properties.map((prop, pIdx) => {
                                const propKey = `${status}.${prop.name}`;
                                const isNestedOpen = !!nestedExpanded[propKey];
                                const hasNested = !!(prop.children || prop.anyOf);

                                return (
                                  <div key={pIdx} className="space-y-1">
                                    <div
                                      onClick={(e) => {
                                        if (hasNested) {
                                          e.stopPropagation();
                                          toggleNested(propKey);
                                        }
                                      }}
                                      className={`flex items-center gap-2 text-[13px] flex-wrap ${hasNested ? 'cursor-pointer' : ''}`}
                                    >
                                      {hasNested ? (
                                        <button
                                          type="button"
                                          className="text-[#757575] hover:text-[#1b1b1b] flex items-center justify-center size-3.5"
                                        >
                                          {isNestedOpen ? (
                                            <MinusIcon className="size-3" />
                                          ) : (
                                            <PlusIcon className="size-3" />
                                          )}
                                        </button>
                                      ) : null}
                                      <span className="font-mono font-bold text-[#1b1b1b]">
                                        {prop.name}
                                      </span>
                                      <span className="text-[#757575] text-[12.5px] font-normal">
                                        {prop.type}
                                      </span>
                                      {prop.required && (
                                        <span className="text-[#c2410c] text-[11.5px] font-normal">
                                          required
                                        </span>
                                      )}
                                      {prop.nullable && (
                                        <span className="text-[#757575] text-[11.5px] font-normal">
                                          nullable
                                        </span>
                                      )}
                                      {prop.preview && (
                                        <span className="text-[#757575] font-mono text-[12px] truncate">
                                          {prop.preview}
                                        </span>
                                      )}
                                      {prop.hasExample && (
                                        <span className="text-[#009485] text-[12px] font-medium cursor-pointer">
                                          Example
                                        </span>
                                      )}
                                      {prop.hasDefault && (
                                        <span className="text-[#757575] text-[11.5px] font-mono">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                    {prop.description && (
                                      <div className={`${hasNested ? 'pl-5' : 'pl-0'} text-[13px] text-[#757575] leading-relaxed mt-0.5`}>
                                        {renderTextWithCode(prop.description)}
                                      </div>
                                    )}
                                    {(isListAsyncTasks || isGetAgentRunStatus || isListExpleeAgents || isFindAndEnrichStatus || isBatchEmailResults || isNlToFilters) && prop.propertiesCount && (
                                      <div className={`${hasNested ? 'pl-5' : 'pl-0'} text-[12px] text-[#757575] font-normal mt-1`}>
                                        Properties: {prop.propertiesCount}
                                      </div>
                                    )}
                                    {(isListAsyncTasks || isGetAgentRunStatus || isListExpleeAgents || isFindAndEnrichStatus || isBatchEmailResults || isNlToFilters) && prop.childModelDescription && (
                                      <div className={`${hasNested ? 'pl-5' : 'pl-0'} text-[13px] text-[#757575] leading-relaxed mt-0.5`}>
                                        {renderTextWithCode(prop.childModelDescription)}
                                      </div>
                                    )}
                                    {/* Nested second-level schema: ONLY rendered when isNestedOpen is true */}
                                    {isNestedOpen && hasNested && (
                                      <div className="pl-5 mt-2 space-y-2.5 border-l border-[rgba(0,0,0,0.08)] ml-2.5">
                                        {prop.anyOf ? (
                                          <div className="space-y-1.5">
                                            <div className="text-[12px] font-medium text-[#757575]">Any of</div>
                                            {prop.anyOf.map((item, aIdx) => (
                                              <div key={aIdx} className="flex items-center gap-2 text-[13px] pl-2">
                                                <span className="text-[#757575]">·</span>
                                                <span className="font-mono font-bold text-[#1b1b1b]">{item.name}</span>
                                                <span className="text-[#757575] text-[12.5px] font-normal">{item.type}</span>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <>
                                            {!(isListAsyncTasks || isGetAgentRunStatus || isListExpleeAgents || isFindAndEnrichStatus || isBatchEmailResults || isNlToFilters) && prop.propertiesCount && (
                                              <div className="text-[12px] text-[#757575] font-normal">
                                                Properties: {prop.propertiesCount}
                                              </div>
                                            )}
                                            {prop.children && prop.children.map((child, cIdx) => {
                                              const childKey = `${propKey}.${child.name}`;
                                              const isChildOpen = !!nestedExpanded[childKey];
                                              const hasChildNested = !!(child.children && child.children.length > 0);

                                              return (
                                                <div key={cIdx} className="space-y-1">
                                                  <div
                                                    onClick={(e) => {
                                                      if (hasChildNested) {
                                                        e.stopPropagation();
                                                        toggleNested(childKey);
                                                      }
                                                    }}
                                                    className={`flex items-center gap-2 text-[13px] flex-wrap ${hasChildNested ? 'cursor-pointer' : ''}`}
                                                  >
                                                    {hasChildNested ? (
                                                      <button
                                                        type="button"
                                                        className="text-[#757575] hover:text-[#1b1b1b] flex items-center justify-center size-3.5"
                                                      >
                                                        {isChildOpen ? (
                                                          <MinusIcon className="size-3" />
                                                        ) : (
                                                          <PlusIcon className="size-3" />
                                                        )}
                                                      </button>
                                                    ) : null}
                                                    <span className="font-mono font-bold text-[#1b1b1b]">
                                                      {child.name}
                                                    </span>
                                                    <span className="text-[#757575] text-[12.5px] font-normal">
                                                      {child.type}
                                                    </span>
                                                    {child.required && (
                                                      <span className="text-[#c2410c] text-[11.5px] font-normal">
                                                        required
                                                      </span>
                                                    )}
                                                    {child.nullable && (
                                                      <span className="text-[#757575] text-[11.5px] font-normal">
                                                        nullable
                                                      </span>
                                                    )}
                                                    {child.hasExample && (
                                                      <span className="text-[#009485] text-[12px] font-medium cursor-pointer">
                                                        Example
                                                      </span>
                                                    )}
                                                  </div>
                                                  {child.description && (
                                                    <div className={`${hasChildNested ? 'pl-5' : 'pl-0'} text-[13px] text-[#757575] leading-relaxed`}>
                                                      {renderTextWithCode(child.description)}
                                                    </div>
                                                  )}
                                                  {child.propertiesCount && (
                                                    <div className={`${hasChildNested ? 'pl-5' : 'pl-0'} text-[12px] text-[#757575] font-normal mt-1`}>
                                                      Properties: {child.propertiesCount}
                                                    </div>
                                                  )}
                                                  {isChildOpen && hasChildNested && (
                                                    <div className="pl-5 mt-2 space-y-2 border-l border-[rgba(0,0,0,0.08)] ml-2.5">
                                                      {child.children.map((grandChild, gIdx) => (
                                                        <div key={gIdx} className="space-y-1">
                                                          <div className="flex items-center gap-2 text-[13px] flex-wrap">
                                                            <span className="font-mono font-bold text-[#1b1b1b]">
                                                              {grandChild.name}
                                                            </span>
                                                            <span className="text-[#757575] text-[12.5px] font-normal">
                                                              {grandChild.type}
                                                            </span>
                                                            {grandChild.required && (
                                                              <span className="text-[#c2410c] text-[11.5px] font-normal">
                                                                required
                                                              </span>
                                                            )}
                                                            {grandChild.nullable && (
                                                              <span className="text-[#757575] text-[11.5px] font-normal">
                                                                nullable
                                                              </span>
                                                            )}
                                                            {grandChild.hasExample && (
                                                              <span className="text-[#009485] text-[12px] font-medium cursor-pointer">
                                                                Example
                                                              </span>
                                                            )}
                                                          </div>
                                                          {grandChild.description && (
                                                            <div className="text-[13px] text-[#757575] leading-relaxed">
                                                              {renderTextWithCode(grandChild.description)}
                                                            </div>
                                                          )}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (564px): Request & Response Cards */}
          <div className="w-[564px] sticky top-6 space-y-4">
            {/* Card 1: Request Code Panel */}
            <div className="rounded-lg border border-[#2e3240] bg-[#1e2029] overflow-hidden shadow-2xs">
              <div className="bg-[#171922] px-3.5 py-2.5 flex items-center justify-between border-b border-[#2e3240]">
                <div className="flex items-center min-w-0">
                  <span className={`font-['JetBrains_Mono',monospace] text-[12px] font-bold ${methodColors[displayMethod] || methodColors[endpoint.method] || 'text-[#009485]'}`}>
                    {displayMethod}
                  </span>
                  <span className="font-['JetBrains_Mono',monospace] text-[12.5px] text-[#d4d4d8] ml-2.5 truncate" title={endpoint.path}>
                    {endpoint.path}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#a1a1aa] font-medium shrink-0 ml-2">
                  <span>{isCustomPythonRoute ? 'Python http.client' : 'Shell Curl'}</span>
                  <ChevronDownIcon className="size-3 text-[#a1a1aa]" />
                </div>
              </div>

              {/* Code execution lines */}
              <div className="p-3.5 font-['JetBrains_Mono',monospace] text-[12.5px] text-[#f4f4f5] leading-[22px] max-h-[460px] overflow-auto custom-scrollbar">
                {isCustomPythonRoute ? (
                  pythonExampleLines.map((line, lIdx) => (
                    <div key={lIdx} className="flex items-start">
                      <span className="text-[#71717a] select-none pr-3 text-right w-6 shrink-0">{line.num}</span>
                      <div className="flex-1 whitespace-pre">
                        {line.content}
                      </div>
                    </div>
                  ))
                ) : (
                  curlLines.map((line, lIdx) => (
                    <div key={lIdx} className="flex items-start">
                      <span className="text-[#71717a] select-none pr-3 text-right w-6 shrink-0">{lIdx + 1}</span>
                      <div className="flex-1 whitespace-pre">
                        {renderCurlLine(line)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action Button Footer: Test Request */}
              <div className="px-3.5 py-2.5 bg-[#171922] border-t border-[#2e3240] flex justify-end">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white text-[#1b1b1b] text-[12px] font-medium rounded hover:bg-[#f4f4f5] transition-colors cursor-pointer border border-[#e4e4e7]"
                >
                  <PlayIcon className="size-2.5 fill-[#1b1b1b] text-[#1b1b1b]" />
                  <span>Test Request</span>
                </button>
              </div>
            </div>

            {/* Card 2: Response Example Panel */}
            <div className="rounded-lg border border-[rgba(0,0,0,0.1)] bg-white overflow-hidden shadow-2xs">
              {/* Header with status tabs + Show Schema area */}
              <div className="bg-white border-b border-[rgba(0,0,0,0.08)] px-3.5 flex items-center justify-between">
                {/* Status tabs */}
                <div className="flex items-center gap-3">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className={`pt-2.5 pb-2 text-[12px] font-['JetBrains_Mono',monospace] transition-colors cursor-pointer relative ${
                        selectedStatus === status
                          ? 'text-[#1b1b1b] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1b1b1b]'
                          : 'text-[#757575] hover:text-[#1b1b1b] font-normal'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Show schema area: copy icon, Show Schema, checkbox in exact order */}
                <div className="flex items-center gap-2 pt-1 pb-1">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 text-[#757575] hover:text-[#1b1b1b] transition-colors cursor-pointer"
                    title={copied ? 'Copied!' : 'Copy response'}
                  >
                    <CopyIcon className="size-3.5" />
                  </button>
                  <span className="text-[12px] text-[#757575] select-none font-normal">Show Schema</span>
                  <input
                    type="checkbox"
                    checked={showSchema}
                    onChange={(e) => setShowSchema(e.target.checked)}
                    className="size-3.5 rounded border-gray-300 text-[#009485] focus:ring-0 cursor-pointer accent-[#009485]"
                  />
                </div>
              </div>

              {/* Code Body */}
              <div className="p-3.5 font-['JetBrains_Mono',monospace] text-[12px] leading-[20px] max-h-[340px] overflow-auto custom-scrollbar bg-white">
                {selectedStatus === 200 ? (
                  renderFormattedJson(currentExampleResponse)
                ) : (
                  renderFormattedJson(
                    isListAsyncTasks && selectedStatus === 422 ? {
                      detail: [
                        {
                          loc: ["string", 0],
                          msg: "string",
                          type: "string"
                        }
                      ]
                    } : {
                      detail: getStatusDesc(selectedStatus)
                    }
                  )
                )}
              </div>

              {/* Footer */}
              <div className="px-3.5 py-2 border-t border-[rgba(0,0,0,0.08)] bg-white text-[12px] text-[#757575] flex items-center justify-between">
                <span>
                  {getStatusDesc(selectedStatus)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subsequent Endpoint in Continuous Scalar Layout */}
      {nextEndpoint && !isChild && (
        <div className="w-full">
          <EndpointContent endpoint={nextEndpoint} isChild={true} />
        </div>
      )}
    </div>
  );
}
