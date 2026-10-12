import os
import json

os.makedirs('src/data', exist_ok=True)

with open('explee-docs-capture/all-pages-master.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)

endpoints = [d for d in raw if d.get('httpMethod') and d.get('endpointPath')]
print(f"Loaded {len(endpoints)} endpoints from all-pages-master.json")

sample_responses = {
    # AutoGTM
    '/public/api/v1/autogtm/projects': {
        'projects': [
            {'id': 4021, 'domain': 'acme.com', 'daily_budget_usd': 50}
        ],
        'total': 1
    },
    '/public/api/v1/autogtm/campaigns': {
        'campaigns': [
            {'id': 17518, 'project_id': 4021, 'name': 'US mid-market SaaS', 'target_url': 'string', 'daily_limit_usd': 30, 'status': 'outreach'}
        ],
        'total': 1
    },
    'PATCH /public/api/v1/autogtm/campaigns/{campaign_id}': {
        'id': 17518,
        'project_id': 1,
        'name': 'string',
        'status': 'outreach',
        'status_reason': 'string',
        'daily_limit_usd': 1,
        'target_url': 'string',
        'offer': 'string',
        'customer_problem': 'string',
        'target_role': 'string',
        'target_geography': 'string',
        'target_company_size': 'string',
        'positive_criteria': [
            'string'
        ],
        'negative_criteria': [
            'string'
        ],
        'example_clients': [
            'string'
        ],
        'keywords': 'string',
        'instructions': '',
        'followup_instructions': '',
        'language': 'auto',
        'reply_instructions': '',
        'schedule': {
            'days': [
                'mon',
                'tue',
                'wed',
                'thu',
                'fri'
            ],
            'use_system_schedule': True,
            'timezone': 'string',
            'working_hours': 'string'
        },
        'followups': {
            'max_touches': 1,
            'delay_days': 1
        },
        'targeting_editable': True
    },
    '/public/api/v1/autogtm/campaigns/{campaign_id}': {
        'id': 17518,
        'name': 'US mid-market SaaS',
        'offer': 'AI-powered B2B prospecting autopilot',
        'customer_problem': 'Low lead conversion and manual outbound overhead',
        'target_role': 'VP Sales, Head of Demand Gen',
        'target_geography': 'United States',
        'target_company_size': '50-500 employees',
        'status': 'active',
        'targeting_editable': True
    },
    '/public/api/v1/autogtm/campaigns/import': {
        'task_id': 'string'
    },
    '/public/api/v1/autogtm/campaigns/import/{task_id}': {
        'task_id': 'task_import_98231',
        'status': 'completed',
        'processed_count': 250,
        'valid_leads': 242,
        'rejected_count': 8
    },
    '/public/api/v1/autogtm/hot-leads': {
        'hot_leads': [
            {'person_id': 'p_88192', 'name': 'Alex Rivera', 'company': 'CloudScale', 'score': 94, 'intent': 'high', 'last_contacted': '2026-09-28T14:22:00Z'}
        ],
        'total': 1
    },
    '/public/api/v1/autogtm/campaigns/{campaign_id}/inbox': {
        'threads': [
            {'thread_id': 'th_01', 'person_id': 'p_88192', 'subject': 'Re: Explee Demo', 'unread': True, 'last_message_at': '2026-09-28T18:04:12Z'}
        ],
        'total': 1
    },
    '/public/api/v1/autogtm/campaigns/{campaign_id}/inbox/{person_id}': {
        'person_id': 'p_88192',
        'name': 'Alex Rivera',
        'messages': [
            {'from': 'me@explee.com', 'to': 'alex@cloudscale.io', 'content': 'Hi Alex, saw your recent expansion...', 'sent_at': '2026-09-28T10:00:00Z'},
            {'from': 'alex@cloudscale.io', 'to': 'me@explee.com', 'content': 'Interested in learning more.', 'sent_at': '2026-09-28T14:22:00Z'}
        ]
    },
    '/public/api/v1/autogtm/campaigns/{campaign_id}/inbox/{person_id}/reply': {
        'status': 'sent',
        'message_id': 'msg_99182',
        'sent_at': '2026-09-28T15:30:00Z'
    },
    '/public/api/v1/autogtm/campaigns/{campaign_id}/inbox/{person_id}/note': {
        'note': 'Follow up next Tuesday after product webinar'
    },
    '/public/api/v1/autogtm/projects/{project_id}/budget': {
        'project_id': 4021,
        'daily_budget_usd': 50,
        'currency': 'USD'
    },
    '/public/api/v1/autogtm/campaigns/{campaign_id}/budget': {
        'campaign_id': 17518,
        'daily_limit_usd': 30,
        'currency': 'USD'
    },
    '/public/api/v1/autogtm/campaigns/{campaign_id}/stop': {
        'campaign_id': 17518,
        'status': 'stopped'
    },
    '/public/api/v1/autogtm/campaigns/{campaign_id}/start': {
        'campaign_id': 17518,
        'status': 'active'
    },
    '/public/api/v1/autogtm/campaigns/{campaign_id}/analytics': {
        'campaign_id': 17518,
        'sent': 1420,
        'opened': 892,
        'replied': 118,
        'meetings_booked': 24
    },
    '/public/api/v1/autogtm/projects/{project_id}/analytics': {
        'project_id': 4021,
        'total_sent': 5210,
        'total_replied': 428,
        'total_meetings': 86
    },
    'POST /public/api/v1/autogtm/suppress-list/people': {
        'list': 'string',
        'added': 1,
        'skipped': 1
    },
    '/public/api/v1/autogtm/suppress-list/people': {
        'lists': [
            {'list': 'string', 'count': 1, 'created_at': '2026-09-29T01:07:09.619Z'}
        ]
    },
    '/public/api/v1/autogtm/suppress-list/people/{list_name}': {
        'list_name': 'competitors_leads',
        'people': ['john.doe@competitor.com', 'jane.smith@rival.io'],
        'total': 2
    },
    'POST /public/api/v1/autogtm/suppress-list/companies': {
        'list': 'string',
        'added': 1,
        'skipped': 1
    },
    '/public/api/v1/autogtm/suppress-list/companies': {
        'lists': [
            {'list': 'string', 'count': 1, 'created_at': '2026-09-29T01:07:09.619Z'}
        ]
    },
    '/public/api/v1/autogtm/suppress-list/companies/{list_name}': {
        'list_name': 'blocked_domains',
        'domains': ['competitor.com', 'rival.io'],
        'total': 2
    },
    'PATCH /public/api/v1/autogtm/projects/{project_id}/autopilot': {
        'project_id': 1,
        'autopilot_enabled': True,
        'auto_reply_enabled': True,
        'auto_reply_delay_minutes': 1,
        'reply_cc_emails': [
            'string'
        ]
    },
    '/public/api/v1/autogtm/projects/{project_id}/autopilot': {
        'autopilot_enabled': True,
        'auto_reply_enabled': True,
        'daily_max_new_leads': 100
    },

    # Search
    '/public/api/v1/search/companies': {
        'success': True,
        'companies': [
            {
                'domain': 'openai.com',
                'name': 'OpenAI',
                'description': 'AI research and deployment company',
                'description_website': 'string',
                'industry': 'IT Services and IT Consulting',
                'industries_nace': [
                    {
                        'code': 'J63.1.2',
                        'description': 'Web portals',
                        'sector': 'Information and communication'
                    }
                ],
                'url': 'https://openai.com',
                'linkedin_id': 14265142,
                'domain_is_alive': 0.95,
                'geo': 'US',
                'geo_subdivision': 'California',
                'geo_city': 'San Francisco',
                'geo_countries': {
                    'DE': 15,
                    'GB': 25,
                    'US': 60
                },
                'geo_country_employees': {
                    'CA': 55,
                    'GB': 56,
                    'IN': 100,
                    'US': 1080,
                    'total': 1555
                },
                'geo_countries_traffic': {
                    'US': 47
                },
                'geo_founders': [
                    'US',
                    'IN'
                ],
                'size': 2500,
                'employees_by_department': {
                    'employees_count_finance': 73
                }
            }
        ]
    },
    '/public/api/v1/search/companies-by-domains': {
        'success': True,
        'companies': [
            {
                'domain': 'openai.com',
                'name': 'OpenAI',
                'description': 'AI research and deployment company',
                'description_website': 'string',
                'industry': 'IT Services and IT Consulting',
                'industries_nace': [
                    {
                        'code': 'J63.1.2',
                        'description': 'Web portals',
                        'sector': 'Information and communication'
                    }
                ],
                'url': 'https://openai.com',
                'linkedin_id': 14265142,
                'domain_is_alive': 0.95,
                'geo': 'US',
                'geo_subdivision': 'California',
                'geo_city': 'San Francisco',
                'geo_countries': {
                    'DE': 15,
                    'GB': 25,
                    'US': 60
                },
                'geo_country_employees': {
                    'CA': 55,
                    'GB': 56,
                    'IN': 100,
                    'US': 1080,
                    'total': 1555
                },
                'geo_countries_traffic': {
                    'US': 47
                }
            }
        ]
    },
    '/public/api/v1/search/people': {
        'success': True,
        'people': [
            {
                'first_name': 'John',
                'last_name': 'Smith',
                'title': 'Head of Sales',
                'headline': 'Sales Leader | B2B SaaS',
                'linkedin_url': 'https://linkedin.com/in/johnsmith',
                'follower_count': 1234,
                'summary': 'string',
                'geo_origin': 'string',
                'duration': 'string',
                'company_linkedin_id': 12345678,
                'company_name': 'Acme Inc',
                'company_domain': 'acme.com',
                'company_url': 'https://acme.com',
                'company_raw_address': 'string',
                'company_geo_subdivision': 'string',
                'company_city': 'San Francisco',
                'company_description': 'string',
                'company_industry': 'IT Services and IT Consulting'
            }
        ]
    },
    '/public/api/v1/search/people-by-domains': {
        'success': True,
        'people': [
            {
                'first_name': 'John',
                'last_name': 'Smith',
                'title': 'Head of Sales',
                'headline': 'Sales Leader | B2B SaaS',
                'linkedin_url': 'https://linkedin.com/in/johnsmith',
                'geo': 'US',
                'summary': 'string',
                'geo_origin': 'string',
                'duration': 'string',
                'follower_count': 1234,
                'company_name': 'Acme Inc',
                'company_domain': 'acme.com',
                'company_url': 'https://acme.com',
                'company_linkedin_id': 12345678,
                'company_linkedin_url': 'string',
                'company_size': '51-200',
                'company_geo': 'US',
                'company_geo_subdivision': 'string',
                'company_geo_city': 'San Francisco',
                'company_description': 'string',
                'company_industry': 'IT Services and IT Consulting',
                'company_industries_nace': [
                    {
                        'code': 'J63.1.2',
                        'description': 'Web portals',
                        'sector': 'Information and communication'
                    }
                ],
                'company_founded': 2015,
                'company_traffic': 25000000,
                'company_traffic_growth': 0.12,
                'company_web_metrics_bounce_rate': 0.41,
                'company_web_metrics_pages_per_visit': 3.2,
                'company_web_metrics_time_on_site': 185.5,
                'company_marketing_pixels': [
                    'google_ads',
                    'meta',
                    'linkedin'
                ]
            }
        ]
    },
    '/public/api/v1/search/nl-to-filters': {
        'filters': {
            'definition': 'B2B SaaS companies in North America',
            'industries': ['Software', 'Internet'],
            'employee_range': [50, 500],
            'countries': ['US', 'CA']
        },
        'confidence': 0.96
    },

    # Contact
    '/public/api/v1/enrich/email': {
        'status': 'found',
        'email': 'sarah.connor@cyberdyne.com',
        'deliverability': 'deliverable',
        'confidence_score': 98,
        'provider': 'Google Workspace'
    },
    '/public/api/v1/enrich/phone': {
        'status': 'found',
        'phone': '+1-415-555-0199',
        'type': 'direct_mobile',
        'country': 'US'
    },
    '/public/api/v1/enrich/email/batch': {
        'task_id': '550e8400-e29b-41d4-a716-446655440000'
    },
    '/public/api/v1/enrich/email/batch/{task_id}': {
        'task_id': 'task_batch_7721',
        'status': 'completed',
        'results': [
            {
                'name': 'Sarah Connor',
                'company_domain': 'cyberdyne.com',
                'email': 'sarah.connor@cyberdyne.com',
                'deliverability': 'deliverable'
            }
        ],
        'processed': 25,
        'found': 22
    },
    '/public/api/v1/find-and-enrich': {
        'task_id': 'task_fae_3389',
        'status': 'queued',
        'message': 'Find and enrich pipeline initiated'
    },
    '/public/api/v1/find-and-enrich/{task_id}': {
        'task_id': 'task_fae_3389',
        'status': 'completed',
        'contacts': [
            {
                'first_name': 'Elena',
                'last_name': 'Rostova',
                'title': 'Head of Growth',
                'company': 'FinTech Corp',
                'email': 'elena@fintechcorp.io',
                'phone': '+1-212-555-0143'
            }
        ],
        'total_found': 15
    },

    # Agents
    '/public/api/v1/agents': {
        'agents': [
            {
                'id': 'ag_researcher_v1',
                'name': 'Company Deep Researcher',
                'description': 'Scrapes news, SEC filings, tech stacks, and team updates',
                'cost_per_run': 2.5
            },
            {
                'id': 'ag_personalizer_v1',
                'name': 'Email Personalization Agent',
                'description': 'Drafts bespoke cold outbound icebreakers based on recent LinkedIn posts',
                'cost_per_run': 1.0
            }
        ]
    },
    '/public/api/v1/agents/{agent_id}/runs': {
        'run_id': 'run_99410',
        'agent_id': 'ag_researcher_v1',
        'status': 'running',
        'started_at': '2026-09-29T00:15:00Z'
    },
    '/public/api/v1/agents/runs': {
        'run_id': 'string'
    },
    '/public/api/v1/agents/runs/{run_id}': {
        'run_id': 'run_99410',
        'status': 'completed',
        'result': {
            'summary': 'CloudScale announced series B funding of $45M last month. Primary expansion focus is EMEA enterprise.',
            'key_executives': ['Alex Rivera (VP Sales)', 'Maria Chen (CTO)'],
            'technologies_detected': ['Segment', 'Snowflake', 'HubSpot', 'AWS']
        },
        'execution_time_seconds': 14.2
    },

    # Tasks
    '/public/api/v1/tasks': {
        'tasks': [
            {
                'task_id': 'task_batch_7721',
                'type': 'email_batch_enrichment',
                'status': 'completed',
                'progress': 1.0,
                'created_at': '2026-09-29T00:00:00Z'
            },
            {
                'task_id': 'task_fae_3389',
                'type': 'find_and_enrich',
                'status': 'running',
                'progress': 0.65,
                'created_at': '2026-09-29T00:10:00Z'
            }
        ],
        'total': 2
    },

    # Billing
    '/public/api/v1/billing/balance': {
        'organization_id': 'org_77189',
        'remain': 1450.25,
        'currency': 'credits',
        'monthly_allowance': 5000,
        'plan': 'growth',
        'auto_topup': True
    },

    # Feedback
    '/public/api/v1/feedback': {
        'status': 'received',
        'feedback_id': 'fb_66192',
        'message': 'Thank you for helping us improve Explee!'
    },

    # Deduplication
    'POST /public/api/v1/dedup/people': {
        'success': True,
        'id': 'string',
        'name': 'string',
        'total': 1,
        'invalid_count': 0,
        'invalid_sample': []
    },
    '/public/api/v1/dedup/people': {
        'success': True,
        'lists': [
            {
                'id': 'string',
                'name': 'string',
                'total': 1,
                'created_at': 'string'
            }
        ]
    },
    '/public/api/v1/dedup/people/{list_id}': {
        'list_id': 'dl_people_q3',
        'name': 'Q3 Outbound Reached',
        'total_entries': 4200,
        'sample_entries': [
            'sarah.connor@cyberdyne.com',
            'john.doe@example.com'
        ]
    },
    'POST /public/api/v1/dedup/companies': {
        'success': True,
        'id': 'string',
        'name': 'string',
        'total': 1,
        'invalid_count': 0,
        'invalid_sample': []
    },
    '/public/api/v1/dedup/companies': {
        'success': True,
        'lists': [
            {
                'id': 'string',
                'name': 'string',
                'total': 1,
                'created_at': 'string'
            }
        ]
    },
    '/public/api/v1/dedup/companies/{list_id}': {
        'list_id': 'dl_comp_enterprise',
        'name': 'Current Enterprise Customers',
        'total_entries': 350,
        'sample_entries': [
            'stripe.com',
            'airbnb.com',
            'salesforce.com'
        ]
    },
}

sample_payloads = {
    '/public/api/v1/search/companies': '{\n  "filters": {\n    "definition": "AI B2B SaaS",\n    "page": 1,\n    "page_size": 100\n  }\n}',
    '/public/api/v1/search/companies-by-domains': '{\n  "domains": [\n    "stripe.com",\n    "airbnb.com"\n  ]\n}',
    '/public/api/v1/search/people': '{\n  "filters": {\n    "job_titles": ["VP Engineering", "CTO"],\n    "countries": ["US"]\n  }\n}',
    '/public/api/v1/search/people-by-domains': '{\n  "domains": ["salesforce.com"],\n  "job_titles": ["CEO", "Founder"]\n}',
    '/public/api/v1/search/nl-to-filters': '{\n  "query": "B2B SaaS companies in California using Stripe"\n}',
    '/public/api/v1/enrich/email': '{\n  "first_name": "Sarah",\n  "last_name": "Connor",\n  "company_domain": "cyberdyne.com"\n}',
    '/public/api/v1/enrich/phone': '{\n  "linkedin_url": "https://linkedin.com/in/sarah-connor"\n}',
    '/public/api/v1/enrich/email/batch': '{\n  "contacts": [\n    {\n      "first_name": "Sarah",\n      "last_name": "Connor",\n      "company_domain": "cyberdyne.com"\n    }\n  ]\n}',
    '/public/api/v1/find-and-enrich': '{\n  "filters": {\n    "job_titles": ["Head of Growth"],\n    "countries": ["US"]\n  },\n  "max_contacts": 50\n}',
    '/public/api/v1/agents/{agent_id}/runs': '{\n  "input": {\n    "company_domain": "cloudscale.io"\n  }\n}',
    '/public/api/v1/agents/runs': '{\n  "system_prompt": "Extract company competitors",\n  "instructions": "Search and identify top 3 competitors for Stripe"\n}',
    '/public/api/v1/feedback': '{\n  "message": "Great API documentation! Would love to see Python SDK examples as well.",\n  "email": "dev@acme.com"\n}',
    '/public/api/v1/dedup/people': '{\n  "name": "Q3 Outbound Reached",\n  "people": [\n    "sarah.connor@cyberdyne.com",\n    "john.doe@example.com"\n  ]\n}',
    '/public/api/v1/dedup/companies': '{\n  "name": "Current Enterprise Customers",\n  "domains": [\n    "stripe.com",\n    "airbnb.com",\n    "salesforce.com"\n  ]\n}',
}

tag_counters = {}
processed = []

for idx, ep in enumerate(endpoints):
    path = ep.get('endpointPath')
    method = ep.get('httpMethod')
    label = ep.get('label')
    tag = ep.get('tag', 'general')
    
    tag_idx = tag_counters.get(tag, 0)
    tag_counters[tag] = tag_idx + 1

    # Keep autogtm-0 format for autogtm, and tag-N for others
    ep_id = f'{tag}-{tag_idx}'

    # Extract clean parameters
    params = []
    for p in ep.get('parameters', []):
        name = p.get('name')
        if name and not (name.isdigit() and len(name) == 3) and name != 'X-API-Key' and '/' not in name:
            params.append({
                'name': name,
                'type': p.get('type') or 'string',
                'required': p.get('required', False),
                'description': p.get('description') or ''
            })

    # Extract status code responses
    responses = []
    for p in ep.get('parameters', []):
        name = p.get('name')
        if name and name.isdigit() and len(name) == 3:
            responses.append({
                'status': int(name),
                'description': p.get('description') or ''
            })
    
    if not responses:
        responses = [
            {'status': 200, 'description': 'Successful Response'},
            {'status': 401, 'description': 'Invalid or missing API key. Include X-API-Key header.'},
            {'status': 402, 'description': 'Insufficient credit balance.'},
            {'status': 422, 'description': 'Validation error. Check request body and parameters.'},
            {'status': 429, 'description': 'Rate limit exceeded.'},
            {'status': 500, 'description': 'Internal server error.'}
        ]

    example = sample_responses.get(f'{method} {path}', sample_responses.get(path, {
        'status': 'success',
        'data': {
            'endpoint': path,
            'method': method,
            'timestamp': '2026-09-28T22:00:00Z'
        }
    }))

    is_post_or_patch = method in ('POST', 'PATCH')
    if is_post_or_patch:
        payload = sample_payloads.get(path, '{\n  "example": "value"\n}')
        curl = f'curl -X {method} "https://api.explee.com{path}" \\\n  -H "X-API-Key: $EXPLEE_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{payload}\''
    else:
        curl = f'curl "https://api.explee.com{path}" \\\n  -H "X-API-Key: $EXPLEE_API_KEY"'

    full_desc = ep.get('paragraphs', [''])[0] if ep.get('paragraphs') else ''
    
    # Parse structured paragraphs and bullets
    intro_paras = []
    bullet_items = []
    outro_paras = []
    
    if 'Response:' in full_desc:
        parts = full_desc.split('Response:')
        intro_text = parts[0].strip()
        rest = parts[1].strip()
        
        # Intro paragraphs
        sub_p = [p.strip() for p in intro_text.split('\n') if p.strip()]
        if len(sub_p) > 1:
            intro_paras = sub_p
        elif ep.get('paragraphs') and len(ep['paragraphs']) > 2:
            intro_paras = [ep['paragraphs'][1], ep['paragraphs'][2]]
        else:
            intro_paras = [intro_text]
            
        # Check for outro like "Use a project id..." or "Free, and the natural..."
        outro_split = None
        for marker in ['Use a ', 'Free, and ', 'Note that ', 'Pass ']:
            if marker in rest:
                outro_split = rest.split(marker, 1)
                bullet_raw = outro_split[0].strip()
                outro_paras = [marker + outro_split[1].strip()]
                break
        
        if not outro_split:
            bullet_raw = rest
            
        # Extract bullets from bullet_raw
        if ' — ' in bullet_raw or ' - ' in bullet_raw:
            raw_bullets = bullet_raw.split('. ')
            for b in raw_bullets:
                b = b.strip()
                if b and not b.endswith('.'):
                    b += '.'
                if ' — ' in b or ' - ' in b:
                    bullet_items.append(b)
                elif b:
                    outro_paras.append(b)
        else:
            bullet_items = []
            if bullet_raw:
                outro_paras.append(bullet_raw)
    elif 'How It Works' in full_desc or 'How it works' in full_desc:
        kw = 'How It Works' if 'How It Works' in full_desc else 'How it works'
        parts = full_desc.split(kw)
        intro_paras = [parts[0].strip()]
        rest = parts[1].strip()
        
        # Look for Pricing or other sections
        if 'Pricing' in rest:
            p_parts = rest.split('Pricing')
            intro_paras.append(p_parts[0].strip())
            pricing_text = p_parts[1].strip()
            
            # Split pricing bullets
            for line in pricing_text.split('\n'):
                line = line.strip()
                if line:
                    bullet_items.append(line)
        else:
            sub_p = [p.strip() for p in rest.split('\n') if p.strip()]
            for sp in sub_p:
                if len(sp) > 0:
                    intro_paras.append(sp)
    else:
        # Use paragraphs from capture, ignoring HTTP status code descriptions
        ignored_texts = {
            'Successful Response',
            'Invalid or missing API key. Include X-API-Key header.',
            'Insufficient credit balance. Every request needs a positive balance, including requests that fall entirely inside the free results zone. Top up your account.',
            'Validation error. Check request body and parameters.',
            'Rate limit exceeded (10000/hour), concurrent limit reached (150 per organization), or free preview quota exceeded (search requests entirely within the free results zone; the quota depends on your plan).',
            'Internal server error. Contact support if persists.',
            'Request timeout. Please try again later.'
        }
        # In crawler.js, ep.get('paragraphs') has:
        # paragraphs[0] = combined section text
        # paragraphs[1..N] = individual <p> tags
        raw_p = ep.get('paragraphs', [])
        individual_paras = raw_p[1:] if len(raw_p) > 1 else raw_p
        param_desc_set = {p.get('description', '') for p in ep.get('parameters', []) if p.get('description')}
        capture_paras = [
            p.strip() for p in individual_paras 
            if p.strip() and p.strip() not in ignored_texts and p.strip() not in param_desc_set
            and 'Copy link to' not in p and 'requiredExample' not in p and not p.strip().startswith('input_data')
        ]
        intro_paras = capture_paras

    custom_curls = {
        6: (
            "curl /public/api/v1/autogtm/campaigns/1 \\\n"
            "  --request PATCH \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "name": "",\n'
            '  "offer": "",\n'
            '  "customer_problem": "",\n'
            '  "target_role": "",\n'
            '  "target_geography": "",\n'
            '  "target_company_size": "",\n'
            '  "positive_criteria": [\n'
            '    ""\n'
            '  ],\n'
            '  "negative_criteria": [\n'
            '    ""\n'
            '  ],\n'
            '  "example_clients": [\n'
            '    ""\n'
            '  ],\n'
            '  "language": "",\n'
            '  "schedule": {\n'
            '    "days": [\n'
            '      ""\n'
            '    ],\n'
            '    "use_system_schedule": true\n'
            '  },\n'
            '  "followups": {\n'
            '    "max_touches": 1,\n'
            '    "delay_days": 1\n'
            '  }\n'
            "}'"
        ),
        7: (
            "curl /public/api/v1/autogtm/campaigns/import \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "project_id": 1,\n'
            '  "name": "",\n'
            '  "leads": [\n'
            '    {\n'
            '      "email": "",\n'
            '      "first_name": "",\n'
            '      "last_name": "",\n'
            '      "company_domain": "",\n'
            '      "job_title": "",\n'
            '      "linkedin_url": "",\n'
            '      "company_name": ""\n'
            '    }\n'
            '  ],\n'
            '  "instructions": "",\n'
            '  "followup_instructions": "",\n'
            '  "language": ""\n'
            "}'"
        ),
        23: (
            "curl /public/api/v1/autogtm/suppress-list/people \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "people": [\n'
            '    {\n'
            '      "company_domain": "acme.com",\n'
            '      "email": "jane@acme.com",\n'
            '      "first_name": "Jane",\n'
            '      "last_name": "Doe",\n'
            '      "linkedin_url": "https://linkedin.com/in/janedoe"\n'
            '    }\n'
            '  ],\n'
            '  "list": "crm-sync"\n'
            "}'"
        ),
        27: (
            "curl /public/api/v1/autogtm/suppress-list/companies \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "domains": [\n'
            '    "acme.com",\n'
            '    "globex.io"\n'
            '  ],\n'
            '  "list": "crm-customers"\n'
            "}'"
        ),
        31: (
            "curl /public/api/v1/autogtm/projects/1/autopilot \\\n"
            "  --request PATCH \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "autopilot_enabled": true,\n'
            '  "auto_reply_enabled": true,\n'
            '  "auto_reply_delay_minutes": 0,\n'
            '  "reply_cc_emails": [\n'
            '    ""\n'
            '  ]\n'
            "}'"
        ),
        33: (
            "curl /public/api/v1/search/companies \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "filters": {\n'
            '    "criteria": [\n'
            '      "Has enterprise customers",\n'
            '      "Uses modern tech stack"\n'
            '    ],\n'
            '    "definition": "electronic signature platform"\n'
            '  },\n'
            '  "page": 1,\n'
            '  "page_size": 10\n'
            "}'"
        ),
        34: (
            "curl /public/api/v1/search/companies-by-domains \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "domains": [\n'
            '    "bmw.com",\n'
            '    "mercedes-benz.com",\n'
            '    "audi.com"\n'
            '  ]\n'
            "}'"
        ),
        35: (
            "curl /public/api/v1/search/people \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "company_filters": {\n'
            '    "definition": "B2B SaaS Company"\n'
            '  },\n'
            '  "company_linkedin_ids": [],\n'
            '  "page": 1,\n'
            '  "page_size": 10,\n'
            '  "people_filters": {\n'
            '    "criteria": [\n'
            '      "Has lead gen experience"\n'
            '    ],\n'
            '    "geo": [\n'
            '      "US",\n'
            '      "GB"\n'
            '    ],\n'
            '    "job_titles": [\n'
            '      "Head of Sales",\n'
            '      "VP Sales"\n'
            '    ]\n'
            '  }\n'
            "}'"
        ),
        36: (
            "curl /public/api/v1/search/people-by-domains \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "domains": [\n'
            '    "bmw.com",\n'
            '    "mercedes-benz.com",\n'
            '    "audi.com"\n'
            '  ],\n'
            '  "job_titles": [\n'
            '    "Head of Sales",\n'
            '    "VP Marketing"\n'
            '  ],\n'
            '  "people_per_company": 3\n'
            "}'"
        ),
        41: (
            "curl /public/api/v1/enrich/email/batch \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "contacts": [\n'
            '    {\n'
            '      "company_domain": "x.ai",\n'
            '      "first_name": "Ma",\n'
            '      "last_name": "Lin"\n'
            '    },\n'
            '    {\n'
            '      "company_domain": "tesla.com",\n'
            '      "first_name": "Elon",\n'
            '      "last_name": "Musk"\n'
            '    }\n'
            '  ],\n'
            '  "preset": "basic"\n'
            "}'"
        ),
        43: (
            "curl /public/api/v1/find-and-enrich \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "company_filters": {\n'
            '    "definition": "B2B SaaS company"\n'
            '  },\n'
            '  "max_contacts": 500,\n'
            '  "people_filters": {\n'
            '    "geo": [\n'
            '      "US",\n'
            '      "GB"\n'
            '    ],\n'
            '    "job_titles": [\n'
            '      "Head of Sales",\n'
            '      "VP Sales"\n'
            '    ]\n'
            '  },\n'
            '  "preset": "basic"\n'
            "}'"
        ),
        48: (
            "curl /public/api/v1/agents/runs \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "system_prompt": "Find the CEO, founders, and directors of the company by domain.",\n'
            '  "input_schema": {\n'
            '    "properties": {\n'
            '      "domain": {\n'
            '        "type": "string"\n'
            '      }\n'
            '    },\n'
            '    "required": [\n'
            '      "domain"\n'
            '    ],\n'
            '    "type": "object"\n'
            '  },\n'
            '  "output_schema": {\n'
            '    "properties": {\n'
            '      "name": {\n'
            '        "type": "string"\n'
            '      }\n'
            '    },\n'
            '    "required": [\n'
            '      "name"\n'
            '    ],\n'
            '    "type": "object"\n'
            '  },\n'
            '  "input_data": {\n'
            '    "domain": "stripe.com"\n'
            '  }\n'
            "}'"
        ),
        55: (
            "curl /public/api/v1/feedback \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "message": ""\n'
            "}'"
        ),
        58: (
            "curl /public/api/v1/dedup/people \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "people": [\n'
            '    {\n'
            '      "company_domain": "acme.com",\n'
            '      "email": "jane@acme.com",\n'
            '      "first_name": "Jane",\n'
            '      "last_name": "Doe"\n'
            '    }\n'
            '  ],\n'
            '  "linkedin_urls": [\n'
            '    "https://linkedin.com/in/angel-lisinski"\n'
            '  ],\n'
            '  "name": "bought-2026-06-10"\n'
            "}'"
        ),
        60: (
            "curl '/public/api/v1/dedup/people/{list_id}' \\\n"
            "  --request DELETE"
        ),
        62: (
            "curl /public/api/v1/dedup/companies \\\n"
            "  --request POST \\\n"
            "  --header 'Content-Type: application/json' \\\n"
            "  --data '{\n"
            '  "domains": [\n'
            '    "acme.com"\n'
            '  ],\n'
            '  "name": "client-x-portfolio"\n'
            "}'"
        ),
        64: (
            "curl '/public/api/v1/dedup/companies/{list_id}' \\\n"
            "  --request DELETE"
        )
    }

    custom_body_schemas = {
        6: {
            'name': 'CampaignDefinitionUpdate',
            'required': True,
            'description': 'Fields you may change on a campaign. Send only the ones you are changing — an omitted field keeps its value; an empty string or list (or null) clears it. The one exception is name: a campaign always has one, so an empty or null name is a 422.',
            'fields': [
                {'name': 'customer_problem', 'type': 'string · max length: 2000 · nullable', 'required': False, 'description': 'The problem this audience has.'},
                {'name': 'example_clients', 'type': 'array of string · …50 · max length: 200 · nullable', 'required': False, 'description': 'Recognizable companies that fit this ICP.'},
                {'name': 'followups', 'type': 'CampaignFollowupsUpdate · nullable', 'required': False, 'description': 'Read-only per campaign: the follow-up sequence is a project-level setting. Sending the current values back is accepted; different values are a 422.'},
                {'name': 'language', 'type': 'string · max length: 16 · nullable', 'required': False, 'description': 'Language to write in: one of en-US, en-GB, de, fr, es, it, ja, pt, zh, ko, nl, id, tr, pl, ar, vi, th, ru, sv, he, hi, da, cs, ro, fi, hu, no, uk, el, sr, hr, or auto to pick per lead. Note the short form: de, not de-DE.'},
                {'name': 'name', 'type': 'string · min length: 1 · max length: 255 · nullable', 'required': False, 'description': 'Campaign name.'},
                {'name': 'negative_criteria', 'type': 'array of string · …20 · max length: 200 · nullable', 'required': False, 'description': 'Disqualifying signals — look-alikes that are NOT a fit. Re-aims the campaign, exactly like target_geography. On a campaign built from an imported lead list (targeting_editable: false) it is saved with 200 and re-aims nothing — the uploaded list is the audience, so there is no search to re-run.'},
                {'name': 'offer', 'type': 'string · max length: 2000 · nullable', 'required': False, 'description': 'What you offer this audience.'},
                {'name': 'positive_criteria', 'type': 'array of string · …20 · max length: 200 · nullable', 'required': False, 'description': 'Signals that qualify a company for this campaign. Re-aims the campaign, exactly like target_geography. On a campaign built from an imported lead list (targeting_editable: false) it is saved with 200 and re-aims nothing — the uploaded list is the audience, so there is no search to re-run.'},
                {'name': 'schedule', 'type': 'CampaignScheduleUpdate · nullable', 'required': False, 'description': 'Send days. Only the sub-fields you send are changed.'},
                {'name': 'target_company_size', 'type': 'string · max length: 2000 · nullable', 'required': False, 'description': 'Target company size, free text (e.g. "10-200 employees"). Re-aims the campaign, exactly like target_geography.'},
                {'name': 'target_geography', 'type': 'string · max length: 2000 · nullable', 'required': False, 'description': 'Target geographies, free text (e.g. "Spain, Portugal"). Re-aims the campaign: changing it drops the leads it has not contacted yet and makes Explee search again against the new targeting.'},
                {'name': 'target_role', 'type': 'string · max length: 2000 · nullable', 'required': False, 'description': 'Who to reach at the prospect, by responsibility (e.g. "Head of Compliance"). Re-aims the campaign, exactly like target_geography. On a campaign built from an imported lead list (targeting_editable: false) it is saved with 200 and re-aims nothing — the uploaded list is the audience, so there is no search to re-run.'}
            ]
        },
        7: {
            'name': 'CampaignImportPayload',
            'required': True,
            'description': 'Body for creating a campaign from your own lead list.',
            'fields': [
                {'name': 'leads', 'type': 'array of ImportLeadIn · 1…30000', 'required': True, 'description': 'Your leads (1–30,000 per import). Each import creates a new campaign.'},
                {'name': 'name', 'type': 'string · min length: 1 · max length: 80', 'required': True, 'description': 'Name for the new campaign.'},
                {'name': 'project_id', 'type': 'integer', 'required': True, 'description': 'Project to create the campaign in (see GET /public/api/v1/autogtm/projects).'},
                {'name': 'followup_instructions', 'type': 'string · max length: 3000 Default', 'required': False, 'description': 'The same, for every follow-up in the sequence (optional). One shared brief covers all follow-ups.'},
                {'name': 'instructions', 'type': 'string · max length: 3000 Default', 'required': False, 'description': 'Your brief for the first email: what to pitch, tone, call to action (optional, up to 3,000 characters). Written in plain language — the copy itself is still generated per lead. Omit it and the campaign is briefed from your project description alone, as it is today.'},
                {'name': 'language', 'type': 'string · max length: 16 Default', 'required': False, 'description': 'Language to write in (optional): one of en-US, en-GB, de, fr, es, it, ja, pt, zh, ko, nl, id, tr, pl, ar, vi, th, ru, sv, he, hi, da, cs, ro, fi, hu, no, uk, el, sr, hr. Omit it or send auto to pick the language per lead. Note the short form: de, not de-DE.'}
            ]
        },
        23: {
            'name': 'SuppressPeopleBody',
            'required': True,
            'description': 'Add people to a named suppress list.',
            'fields': [
                {'name': 'people', 'type': 'array of SuppressPersonItem · 1…10000', 'required': True, 'description': 'People to suppress (1–10,000 per request — send a bigger ledger as several lists).'},
                {'name': 'list', 'type': 'string · min length: 1 · max length: 255 Default Pattern Example', 'required': False, 'description': 'Name for this list, exactly like a CSV filename in the app. A name already in use gets a (2) suffix — the previous list stays until you delete it. No slashes: the name is a path segment on the read and delete endpoints.'}
            ]
        },
        27: {
            'name': 'SuppressCompaniesBody',
            'required': True,
            'description': 'Add company domains to a named suppress list.',
            'fields': [
                {'name': 'domains', 'type': 'array of string · 1…10000', 'required': True, 'example': True, 'description': 'Company domains to suppress (1–10,000 per request — send a bigger ledger as several lists).'},
                {'name': 'list', 'type': 'string · min length: 1 · max length: 255 Default Pattern Example', 'required': False, 'description': 'Name for this list, exactly like a CSV filename in the app. A name already in use gets a (2) suffix — the previous list stays until you delete it. No slashes: the name is a path segment on the read and delete endpoints.'}
            ]
        },
        31: {
            'name': 'SetAutopilotBody',
            'required': True,
            'description': 'Body for updating autopilot / auto-reply settings. All fields optional — send only what you want to change; at least one is required.',
            'fields': [
                {'name': 'auto_reply_delay_minutes', 'type': 'integer · min: 0 · max: 1440 · nullable', 'required': False, 'description': 'Auto-reply send delay in minutes (0 = instant, max 1440).'},
                {'name': 'auto_reply_enabled', 'type': 'boolean · nullable', 'required': False, 'description': 'Turn AI auto-reply on/off.'},
                {'name': 'autopilot_enabled', 'type': 'boolean · nullable', 'required': False, 'description': 'Turn the autopilot agent on/off.'},
                {'name': 'reply_cc_emails', 'type': 'array of string · …20 · email · nullable', 'required': False, 'description': 'Project defaults added to CC on every manual or automatic reply.'}
            ]
        },
        33: {
            'name': 'SearchCompaniesPayload',
            'required': True,
            'description': 'Request payload for company search.',
            'fields': [
                {'name': 'filters', 'type': 'PublicCompaniesFilters', 'required': True, 'example': True, 'description': 'Search filters. Only definition is required. Use criteria for AI enrichment (+0.1 credits per company per criterion).'},
                {'name': 'exclude_lists', 'type': 'array of string · …100 · nullable', 'required': False, 'example': True, 'description': 'Ids of your dedup lists (see Deduplication endpoints). Results already present in these lists are excluded and never charged. When set, the free results zone does not apply. Max 100 lists / 500000 values combined per request.'},
                {'name': 'page', 'type': 'integer · min: 1 Default Example', 'required': False, 'description': 'Page number, starting from 1.'},
                {'name': 'page_size', 'type': 'integer · min: 1 · max: 1000 Default Example', 'required': False, 'description': 'Number of companies per page. Default: 100, max: 1000.'}
            ]
        },
        34: {
            'name': 'SearchCompaniesByDomainsPayload',
            'required': True,
            'description': 'Request payload for companies search by domains (bulk).',
            'fields': [
                {'name': 'domains', 'type': 'array of string · 1…1000 · max length: 256', 'required': True, 'example': True, 'description': 'List of company domains (max 1000). Each domain will be normalized.'},
                {'name': 'exclude_lists', 'type': 'array of string · …100 · nullable', 'required': False, 'example': True, 'description': 'Ids of your dedup lists (see Deduplication endpoints). Results already present in these lists are excluded and never charged. When set, the free results zone does not apply. Max 100 lists / 500000 values combined per request.'}
            ]
        },
        35: {
            'name': 'SearchPeoplePayload',
            'required': True,
            'description': 'Request payload for people search.',
            'fields': [
                {'name': 'company_filters', 'type': 'PublicCompaniesFilters', 'required': True, 'example': True, 'description': 'Company filters to narrow down which companies to search people from. Use definition for semantic company search.'},
                {'name': 'people_filters', 'type': 'PublicPeopleFilters', 'required': True, 'example': True, 'description': 'People filters: job_titles, geo, criteria for AI enrichment (+0.1 credits per person per criterion).'},
                {'name': 'company_linkedin_ids', 'type': 'array of integer · int64 · nullable', 'required': False, 'example': True, 'description': 'Optional list of company LinkedIn IDs to restrict the search to these companies.'},
                {'name': 'exclude_lists', 'type': 'array of string · …100 · nullable', 'required': False, 'example': True, 'description': 'Ids of your dedup lists (see Deduplication endpoints). Results already present in these lists are excluded and never charged. When set, the free results zone does not apply. Max 100 lists / 500000 values combined per request.'},
                {'name': 'page', 'type': 'integer · min: 1: Default', 'required': False, 'example': True, 'description': 'Page number, starting from 1.'},
                {'name': 'page_size', 'type': 'integer · min: 1 · max: 1000 Default', 'required': False, 'example': True, 'description': 'Number of people per page. Default: 100, max: 1000.'}
            ]
        },
        36: {
            'name': 'SearchPeopleByDomainsPayload',
            'required': True,
            'description': 'Request payload for people search by domains (batch mode).',
            'fields': [
                {'name': 'domains', 'type': 'array of string · 1…1000 · max length: 256', 'required': True, 'example': True, 'description': 'List of company domains (max 1000). Each domain will be normalized.'},
                {'name': 'job_titles', 'type': 'array of string · 1…20 · max length: 256', 'required': True, 'example': True, 'description': 'Job titles to search for (max 20, OR logic). Supports semantic matching.'},
                {'name': 'exclude_lists', 'type': 'array of string · …100 · nullable', 'required': False, 'example': True, 'description': 'Ids of your dedup lists (see Deduplication endpoints). Results already present in these lists are excluded and never charged. When set, the free results zone does not apply. Max 100 lists / 500000 values combined per request.'},
                {'name': 'people_per_company', 'type': 'integer · min: 1 · max: 1000 Default Example', 'required': False, 'description': 'Number of people to return per company (1-1000). Default: 1.'}
            ]
        },
        41: {
            'name': 'BatchEnrichEmailPayload',
            'required': True,
            'description': 'Request payload for batch email enrichment endpoint.',
            'fields': [
                {'name': 'contacts', 'type': 'array of ContactInput · 1…100', 'required': True, 'example': True, 'description': 'List of contacts to enrich (max 100)'},
                {'name': 'preset', 'type': '"basic" or "premium" · enum Default', 'required': False, 'example': False, 'description': 'Quality preset: basic (1 provider, fast) or premium (6 providers, validated)'}
            ]
        },
        43: {
            'name': 'FindAndEnrichPayload',
            'required': True,
            'description': 'Request payload for the find-and-enrich endpoint.',
            'fields': [
                {'name': 'company_filters', 'type': 'PublicCompaniesFilters', 'required': True, 'description': 'Company filters to narrow down which companies to search people from. Use definition for semantic company search.'},
                {'name': 'max_contacts', 'type': 'integer · min: 1 · max: 500', 'required': True, 'example': True, 'description': 'How many enriched contacts (found emails) you want. The search runs as wide as needed to reach this many found emails — you are charged ONLY for emails actually found, never for the search. Capped by your plan export limit.'},
                {'name': 'people_filters', 'type': 'PublicPeopleFilters', 'required': True, 'description': 'People filters used to find candidates: job_titles, geo, followers, etc.'},
                {'name': 'company_linkedin_ids', 'type': 'array of integer · nullable', 'required': False, 'description': 'Optional list of company LinkedIn IDs to restrict the search to these companies.'},
                {'name': 'cursor', 'type': 'string · nullable', 'required': False, 'description': 'Pagination cursor. Omit for the first page; on later pages pass the next_cursor returned by the previous completed job (with the SAME filters/preset) to fetch the next batch.'},
                {'name': 'exclude_lists', 'type': 'array of string · …100 · nullable', 'required': False, 'example': True, 'description': 'Ids of your dedup lists (see Deduplication endpoints). Results already present in these lists are excluded and never charged. When set, the free results zone does not apply. Max 100 lists / 500000 values combined per request.'},
                {'name': 'preset', 'type': '"basic" or "premium" · enum Default', 'required': False, 'description': 'Quality preset: basic (1.5 credits per found email) or premium (5 credits per found email).'}
            ]
        },
        48: {
            'name': 'StartAgentRunPayload',
            'required': True,
            'description': '',
            'fields': [
                {'name': 'input_data', 'type': 'Input Data', 'required': True, 'example': True},
                {'name': 'input_schema', 'type': 'Input Schema', 'required': True, 'example': True},
                {'name': 'output_schema', 'type': 'Output Schema', 'required': True, 'example': True},
                {'name': 'system_prompt', 'type': 'string', 'required': True, 'example': True}
            ]
        },
        58: {
            'name': 'DedupPeopleListPayload',
            'required': True,
            'description': 'A people dedup list, created whole (immutable).',
            'fields': [
                {'name': 'linkedin_urls', 'type': 'array of string · …100000 · nullable', 'required': False, 'example': True, 'description': 'Legacy shortcut for LinkedIn-only lists. Existing clients can keep sending this field unchanged. Normalized and deduplicated on write. Max 100000 total people and legacy URLs.'},
                {'name': 'name', 'type': 'string · max length: 64 · nullable', 'required': False, 'example': True, 'description': 'Optional human-readable label (not unique, not used for matching).'},
                {'name': 'people', 'type': 'array of DedupPersonIdentity · …100000 · nullable', 'required': False, 'example': True, 'description': 'People you already own. You can pass objects returned by people search or find-and-enrich directly. A person is matched by LinkedIn URL, normalized email, or first name + last name + company domain. Invalid identities are skipped and reported. Max 100000 total people and legacy URLs.'}
            ]
        },
        62: {
            'name': 'DedupCompaniesListPayload',
            'required': True,
            'description': 'A companies dedup list, created whole (immutable).',
            'fields': [
                {'name': 'domains', 'type': 'array of string · 1…100000', 'required': True, 'example': True, 'description': 'Domains of companies to exclude (the domain field of search results). Normalized and deduplicated on write. Max 100000 per list.'},
                {'name': 'name', 'type': 'string · max length: 64 · nullable', 'required': False, 'example': True, 'description': 'Optional human-readable label (not unique, not used for matching).'}
            ]
        }
    }

    custom_sections = {
        7: [
            {
                'title': 'How it works:',
                'ordered': True,
                'items': [
                    'Submit project_id, a campaign name, and up to 30,000 leads',
                    'Receive a task_id immediately',
                    'Poll GET /public/api/v1/autogtm/campaigns/import/{task_id} until completed',
                    'result.campaign_id is your new campaign — it appears in the campaigns list'
                ]
            },
            {
                'paragraphs': [
                    'Per lead — mandatory: email, first_name, last_name, company_domain, job_title; recommended: linkedin_url (enriches the lead from Explee\'s contact base for a richer email). Leads missing mandatory fields are skipped (reported in the result), never a request-level error. Duplicates of leads already contacted in the project and do-not-contact entries are dropped.',
                    'Your copy brief — optional instructions (first email), followup_instructions (all follow-ups) and language: the same brief you would type in the app\'s email editor, set here at import time so no manual step is needed. Omit them and the campaign is briefed from your project description alone.',
                    'Pricing: the import itself is free. Emails are verified at send time at Explee\'s cost; sending is billed as usual.'
                ]
            }
        ],
        33: [
            {
                'title': 'How It Works',
                'paragraphs': [
                    'Provide a structured definition of your target companies in the definition field — our AI will find matching companies. All other filters are optional. See the request schema below for the full list of available filters.',
                    'Definition examples:'
                ],
                'ordered': False,
                'items': [
                    '"YouTube video summarization tool"',
                    '"electronic signature platform"',
                    '"AI B2B SaaS"',
                    '"real estate company"'
                ]
            },
            {
                'title': 'AI Enrichment',
                'paragraphs': [
                    'Use the criteria parameter to score companies against custom criteria. Each company will be evaluated and scored (0-5) with reasoning for each criterion.'
                ]
            },
            {
                'title': 'Pricing',
                'ordered': False,
                'items': [
                    'First 10 results are free (including AI enrichment)',
                    'A positive credit balance is required for every request, free results included (an organization at 0 credits gets a 402)',
                    'Entirely-free requests are limited per organization by plan: free 50/day + 10/min · starter 200/day + 15/min · growth 500/day + 20/min · pro 750/day + 25/min · agency 1500/day + 30/min · enterprise 3000/day + 30/min (429 beyond); billable requests are not affected',
                    '0.5 credits per company after the first 10',
                    '+0.1 credits per company per criterion after the first 10'
                ],
                'paragraphs': [
                    'Example: 150 companies with 2 criteria = 50 billable × (0.5 + 0.1 × 2) = 35 credits (first 10 are free)',
                    'Empty results = 0 credits.'
                ]
            },
            {
                'title': 'Deduplication',
                'paragraphs': [
                    'Pass dedup list ids in exclude_lists to skip companies you already own — they are not returned and not charged. Free results zone does not apply. See the Deduplication endpoints.'
                ]
            }
        ],
        34: [
            {
                'title': 'How it works:',
                'ordered': True,
                'items': [
                    'Provide a list of company domains (up to 1000)',
                    'The system looks up each domain and returns at most one company profile per domain (the best match by quality score)'
                ]
            },
            {
                'title': 'Pricing:',
                'ordered': False,
                'items': [
                    '0.5 credit(s) per company found',
                    '0 credits for domains not found'
                ]
            },
            {
                'title': 'Limits:',
                'ordered': False,
                'items': [
                    'Maximum 1000 domains per request',
                    'Maximum 10000 companies per response'
                ]
            },
            {
                'title': 'Deduplication:',
                'ordered': False,
                'items': [
                    'Pass dedup list ids in exclude_lists — matched companies are not returned and not charged'
                ]
            }
        ],
        35: [
            {
                'title': 'How It Works',
                'paragraphs': [
                    'Provide job_titles in people_filters to find people by their role. Use company_filters.definition to narrow down which companies to search. Use company_linkedin_ids to restrict results to a specific list of company LinkedIn IDs.',
                    'Job title examples:'
                ],
                'ordered': False,
                'items': [
                    '["Head of Sales", "VP Sales"]',
                    '["CTO", "VP Engineering"]',
                    '["Founder", "CEO"]'
                ]
            },
            {
                'title': 'AI Enrichment',
                'paragraphs': [
                    'Use the criteria parameter in people_filters to score people against custom criteria. Each person will be evaluated and scored (0-5) with reasoning for each criterion.'
                ]
            },
            {
                'title': 'Pricing',
                'ordered': False,
                'items': [
                    'First 10 results are free (including AI enrichment)',
                    'A positive credit balance is required for every request, free results included (an organization at 0 credits gets a 402)',
                    'Entirely-free requests are limited per organization by plan: free 50/day + 10/min · starter 200/day + 15/min · growth 500/day + 20/min · pro 750/day + 25/min · agency 1500/day + 30/min · enterprise 3000/day + 30/min (429 beyond); billable requests are not affected',
                    '1.0 credit per person after the first 10',
                    '+0.1 credits per person per criterion after the first 10'
                ],
                'paragraphs': [
                    'Example: 150 people with 2 criteria = 50 billable × (1.0 + 0.1 × 2) = 60 credits (first 10 are free)',
                    'Empty results = 0 credits.'
                ]
            },
            {
                'title': 'Deduplication',
                'paragraphs': [
                    'Pass dedup list ids in exclude_lists to skip people you already own — they are not returned and not charged. Free results zone does not apply. See the Deduplication endpoints.'
                ]
            }
        ],
        36: [
            {
                'title': 'How it works:',
                'ordered': True,
                'items': [
                    'Provide a list of company domains (up to 1000) and job titles to search for',
                    'The system finds companies by domains',
                    'Returns up to people_per_company people per found company with matching job titles'
                ]
            },
            {
                'title': 'Job title matching:',
                'ordered': False,
                'items': [
                    'Uses semantic search: "Head of Sales" will match "VP Sales", "Sales Director", etc.',
                    'Multiple job titles are combined with OR logic'
                ]
            },
            {
                'title': 'Parameters:',
                'ordered': False,
                'items': [
                    'people_per_company: Number of people to return per company (1-1000, default: 1)'
                ]
            },
            {
                'title': 'Limits:',
                'ordered': False,
                'items': [
                    'Maximum 1000 domains per request',
                    'Maximum 20 job titles per request',
                    'Maximum 1000 people per company',
                    'Maximum 10000 people per response (total)'
                ]
            },
            {
                'title': 'Billing:',
                'ordered': False,
                'items': [
                    '1 credit per person returned'
                ]
            },
            {
                'title': 'Deduplication:',
                'ordered': False,
                'items': [
                    'Pass dedup list ids in exclude_lists — matched people are not returned and not charged'
                ]
            }
        ],
        41: [
            {
                'title': 'How it works:',
                'ordered': True,
                'items': [
                    'Submit up to 100 contacts with first_name, last_name, company_domain',
                    'Receive a task_id immediately',
                    'Poll GET endpoint with task_id to check status and retrieve results'
                ]
            },
            {
                'title': 'Limits:',
                'ordered': False,
                'items': [
                    'Maximum 100 contacts per batch'
                ]
            },
            {
                'title': 'Pricing:',
                'ordered': False,
                'items': [
                    'basic: 1.5 credits per found email',
                    'premium: 5 credits per found email',
                    'Only charged for emails found (not found = 0 credits)'
                ]
            }
        ],
        43: [
            {
                'title': 'How it works:',
                'ordered': True,
                'items': [
                    'Submit search filters + max_contacts (how many contacts with emails you want, max 500 per call)',
                    'Receive a task_id immediately',
                    'Poll the GET endpoint with task_id for progress (with eta_seconds) and results',
                    'For more than max_contacts, call again with the previous response\'s next_cursor'
                ]
            },
            {
                'title': 'Pricing:',
                'ordered': False,
                'items': [
                    'Search is free — you are never charged for people searched.',
                    'basic: 1.5 credits per found email · premium: 5 credits per found email.',
                    'You are charged ONLY for emails actually found. Worst-case credits are held up front (402 if insufficient).'
                ]
            },
            {
                'title': 'Deduplication:',
                'paragraphs': [
                    'Deduplication: pass exclude_lists to skip people you already own — they are not enriched and not charged.'
                ]
            }
        ],
        58: [
            {
                'title': 'Limits:',
                'paragraphs': [
                    '100,000 values per list; per search request: 100 lists, 500,000 values combined.'
                ]
            }
        ],
        62: [
            {
                'title': 'Limits:',
                'paragraphs': [
                    '100,000 values per list; per search request: 100 lists, 500,000 values combined.'
                ]
            }
        ]
    }

    r_idx = ep.get('routeIndex')
    if r_idx in custom_curls:
        curl = custom_curls[r_idx]
    
    body_schema = custom_body_schemas.get(r_idx)
    sections = custom_sections.get(r_idx)
    if body_schema:
        params = [p for p in params if '{' + p['name'] + '}' in path]
    
    if r_idx == 6:
        intro_paras = [
            "Correct a campaign's definition — send only the fields you are changing.",
            "An omitted field keeps its value; an empty string, empty list or null clears it — except name, which a campaign always has, so clearing it is a 422. An unknown field name is rejected with 422 rather than silently ignored, so a typo can never look like a successful write. Returns the full definition as it now stands.",
            "Re-aiming costs leads. Changing target_role, target_geography, target_company_size, positive_criteria or negative_criteria is a retarget, exactly as in the app: the leads this campaign has not contacted yet are dropped and Explee searches again against the new targeting. Editing the offer or the email briefs does not — it only changes what is written to the leads still to come. Emails already sent are never affected.",
            "The rule for this endpoint: anything a person can edit on the campaign in the app, you can edit here — with the exceptions below, each of which exists because the app validates it in a second step this endpoint cannot reproduce.",
            "Read-only here: instructions and followup_instructions (the copy briefs — the app moderates them right after saving and shows you the verdict; this endpoint has no preview to show, and an unmoderated brief only fails later, at send time), target_url and reply_instructions (their own two-step save), keywords (Explee derives it; read-only in the app too) and followups (a project-level setting shared by every campaign of the project: sending the current values back is accepted, different ones are a 422). Budget has PATCH /public/api/v1/autogtm/campaigns/{campaign_id}/budget, status has start / stop. You can still SET the briefs when you create a campaign — POST /public/api/v1/autogtm/campaigns/import takes instructions, followup_instructions and language."
        ]
    elif r_idx == 7:
        intro_paras = [
            "Create a new campaign from your own lead list (async).",
            "Each call creates a new campaign in the given project — the campaign is built for your leads only (no agent lead discovery) and starts sending automatically once live, within your project budget."
        ]
    elif r_idx == 23:
        intro_paras = [
            "Store a list of people to suppress — the same lists the Suppress list page in the app shows, so a list pushed from your CRM sits next to the CSVs your team uploaded and behaves identically.",
            "The suppress list is organization-wide: it applies to every AutoGTM campaign, running or not. Every email is checked against it right before it goes out, so an address added here stops a sequence that is already mid-flight, not just future ones.",
            "Matching is exact: a person by their email address (case-insensitive, but jane+crm@acme.com and jane@acme.com are two different entries), a company by its domain (the lead's company domain or the domain of its email address — acme.com does not cover eu.acme.com, list each domain you use).",
            "One call = one list, exactly like uploading one CSV: a list name that is already taken gets a (2) suffix rather than merging, and lists are independent — the same person on two lists is suppressed until both are gone. Delete a list you no longer want.",
            "Each person needs at least one identifier: an email, a LinkedIn URL, or a full name; a row left without a usable one (including a malformed address) comes back in skipped instead of failing the whole batch. Outreach stops on the email — the name and LinkedIn fields are stored but not actively used today; they are kept because a suppressed person is more than their email address, and the day outreach runs somewhere other than email (LinkedIn and the like) those are the fields that will match. To suppress everyone at a company use the companies endpoint."
        ]
    elif r_idx == 27:
        intro_paras = [
            "Store a list of company domains to suppress — nobody at these companies is contacted.",
            "The suppress list is organization-wide: it applies to every AutoGTM campaign, running or not. Every email is checked against it right before it goes out, so an address added here stops a sequence that is already mid-flight, not just future ones.",
            "Matching is exact: a person by their email address (case-insensitive, but jane+crm@acme.com and jane@acme.com are two different entries), a company by its domain (the lead's company domain or the domain of its email address — acme.com does not cover eu.acme.com, list each domain you use).",
            "One call = one list, exactly like uploading one CSV: a list name that is already taken gets a (2) suffix rather than merging, and lists are independent. Delete a list you no longer want.",
            "Domains are normalized (https://www.acme.com/careers -> acme.com), so two spellings of one company collapse into a single entry. Values that are not a domain come back as skipped. Subdomains are separate entries — acme.com does not cover eu.acme.com."
        ]
    elif r_idx == 31:
        intro_paras = [
            "Update the project's autopilot / auto-reply settings. Send only the fields you want to change — at least one is required.",
            "Turning autopilot_enabled off hands per-campaign budgets back to you (PATCH .../campaigns/{id}/budget stops returning 409); turning it on makes them agent-managed again."
        ]
    elif r_idx == 33:
        intro_paras = [
            "Search for companies using structured definitions."
        ]
    elif r_idx == 34:
        intro_paras = [
            "Find companies by their domains."
        ]
    elif r_idx == 35:
        intro_paras = [
            "Search for people (employees) at companies matching your criteria."
        ]
    elif r_idx == 36:
        intro_paras = [
            "Find people at companies by their domains."
        ]
    elif r_idx == 41:
        intro_paras = [
            "Find email addresses for multiple contacts in one request (async)."
        ]
    elif r_idx == 43:
        intro_paras = [
            "Search for people matching your filters and enrich their emails in a single async job."
        ]
    elif r_idx == 48:
        intro_paras = [
            "Run a fully custom agent — you provide the system prompt, input/output schemas, and input data.",
            "Use this when Explee's pre-built agents don't fit your use case. The agent will execute asynchronously; poll GET /agents/runs/{job_id} for results.",
            "Cost: 1 credit per run."
        ]
    elif r_idx == 58:
        intro_paras = [
            "Create an immutable list of people you already own. Pass the person objects returned by people search or find-and-enrich in people; they are matched by LinkedIn URL, normalized email, or first name + last name + company domain. Existing integrations can keep using the legacy linkedin_urls field.",
            "Pass the returned id in exclude_lists on people search — matched people are not returned and not charged.",
            "Lists can't be modified: to grow your ledger, create a new list per batch and pass all ids; consolidate periodically. URLs are normalized on write; unparseable values are skipped and reported."
        ]
    elif r_idx == 62:
        intro_paras = [
            "Create an immutable list of companies you already own (domain values from search results). Pass the returned id in exclude_lists on companies search — matched companies are not returned and not charged.",
            "Lists can't be modified: to grow your ledger, create a new list per batch and pass all ids; consolidate periodically. Domains are normalized on write; unparseable values are skipped and reported."
        ]

    processed.append({
        'id': ep_id,
        'tagIndex': tag_idx,
        'globalIndex': idx,
        'routeIndex': r_idx,
        'label': label,
        'tag': tag,
        'method': method,
        'path': path,
        'hash': ep.get('hashRoute'),
        'description': full_desc,
        'introParagraphs': intro_paras,
        'bulletItems': bullet_items,
        'outroParagraphs': outro_paras,
        'parameters': params,
        'responses': responses,
        'exampleResponse': example,
        'curlCommand': curl,
        'curlCode': custom_curls.get(r_idx),
        'bodySchema': body_schema,
        'sections': sections
    })

out_path = 'src/data/endpointsData.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(processed, f, indent=2, ensure_ascii=False)

print(f"Saved {len(processed)} endpoints across {len(tag_counters)} tags to {out_path}")
for tag, count in tag_counters.items():
    print(f"  {tag}: {count} endpoints")
