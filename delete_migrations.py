import os
import shutil
path = 'backend/core'
# add new_folder_name/migrations
folders = ['applicant/migrations', 'applications/migrations', 'edu/migrations', 'employment_details/migrations', 'job_posts/migrations', 'recruiter/migrations', 'user/migrations']
for folder in folders:
    files = os.listdir(path+'/'+folder)
    if "__init__.py" in files:
        files.remove('__init__.py')
    if "__pycache__" in files:
        files.remove('__pycache__')
    try:
        shutil.rmtree(path+'/'+folder+'/__pycache__')
    except:
        pass
    for f in files:
        try:
            os.remove(path+'/'+folder+'/'+f)
        except:
            pass