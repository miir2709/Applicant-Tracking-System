import LSH
from Parser import jd_result_wrapper, resume_result_wrapper
import pandas as pd

jd_filename = ''                # Current Job Post - Job Description Filename
resume_filenames = ''           # List of Current Job Post - Applicant Resume Filenames

# NOTE: Parse the job description and resume, and store the result in the database

#### The following part will be modified as per the webapp requirements
#### Modification: Get the parsed directly from the database
#### Use wrapper function along with all the preprocessing while uploading resume/job description

jd_parsed = jd_result_wrapper(jd_filename)
all_resume_parsed = [resume_result_wrapper(x) for x in resume_filenames]

df = pd.DataFrame({'Resume_Filenames': resume_filenames, 'Skills': all_resume_parsed})
#### Generate LSH Forest

forest = LSH.get_forest(all_resume_parsed)

#### Query for Resumes

jd = sorted([w.lower() for w in jd_parsed['skills']])
jd = ' '.join(w for w in jd)

num_recommendations = len(all_resume_parsed)
result = LSH.predict(jd, df, 128, num_recommendations, forest)

## result is a dataframe of just the recommended filenames. Sort the applicants data using these results

