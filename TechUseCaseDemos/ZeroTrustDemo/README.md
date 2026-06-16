# Zero Trust Architecture Demo

## Learning Objectives
- Understand Zero Trust security principles
- Learn to implement least-privilege access controls
- Practice access decision workflows
- Understand role-based access control (RBAC)

## How to Run
1. Open `index.html` in a browser
2. Select a user from the dropdown
3. Select a resource to access
4. Click "Request Access"
5. Review the access decision and policy details

## Users & Roles
| User | Role | Clearance | Resources |
|------|------|-----------|-----------|
| Alice | Developer | Medium | API, Fileshare |
| Bob | Analyst | Low | API |
| Charlie | Guest | None | None |

## Resources
| Resource | Min Clearance | Admin Only |
|----------|---------------|------------|
| Database | Medium | No |
| API | Low | No |
| Fileshare | Medium | No |
| Admin Panel | High | Yes |

## Zero Trust Principles
1. **Verify Explicitly**: Authenticate and authorize every request
2. **Use Least Privilege**: Grant minimum necessary access
3. **Assume Breach**: Operate as if the network is compromised

## Attribution
This demo is part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents) by Professor Vinaya Sathyanarayana.

**Educational Use Only** - For usage guidelines, see the main repository.