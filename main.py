import os

from numpy import e
import utils
import spacy
import pprint
import nltk
from spacy.matcher import Matcher
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity, euclidean_distances

class JobDescriptionParser():

    def __init__(self, jd):
        nlp = spacy.load('en_core_web_md')
        self.matcher = Matcher(nlp.vocab)
        self.details = {'skills' : None}
        self.jd = jd
        self.text_raw = utils.extract_text(self.jd, os.path.splitext(self.jd)[1])
        self.text = ' '.join(self.text_raw.split())
        self.nlp = nlp(self.text)
        self.nouns = list(self.nlp.noun_chunks)
        self.getDetails()

    def get_extracted_data(self):
        return self.details

    def getDetails(self):
        skills = utils.extract_skills(self.nlp, self.nouns)
        self.details['skills'] = skills
        return

class ResumeParser():

    def __init__(self, resume):
        nlp = spacy.load('en_core_web_md')
        self.matcher = Matcher(nlp.vocab)
        self.details = {
            'name' : None,
            'email' : None,
            'mobile_number' : None,
            'skills' : None,
            'education' : None,
            'experience' : None,
        }
        self.resume = resume
        self.text_raw = utils.extract_text(self.resume, os.path.splitext(self.resume)[1])
        self.text = ' '.join(self.text_raw.split())
        self.nlp = nlp(self.text)
        self.nouns = list(self.nlp.noun_chunks)
        self.getDetails()

    def get_extracted_data(self):
        return self.details

    def getDetails(self):
        name = utils.extract_name(self.nlp, matcher=self.matcher)
        email = utils.extract_email(self.text)
        mobile = utils.extract_mobile_number(self.text)
        skills = utils.extract_skills(self.nlp, self.nouns)
        edu = utils.extract_education([sent.text.strip() for sent in self.nlp.sents])
        experience = utils.extract_experience(self.text)
        self.details['name'] = name
        self.details['email'] = email
        self.details['mobile_number'] = mobile
        self.details['skills'] = skills
        self.details['education'] = edu
        self.details['experience'] = experience
        return

def jd_result_wrapper(jd):
    parser = JobDescriptionParser(jd)
    return parser.get_extracted_data()

def resume_result_wrapper(resume):
    parser = ResumeParser(resume)
    return parser.get_extracted_data()

def get_similarity(skills, jd, nlp):
    for i in range(len(skills)):
        skills[i] = skills[i].lower()
    skills = ' '.join(i for i in skills)

    for i in range(len(jd)):
        jd[i] = jd[i].lower()
    jd = ' '.join(i for i in jd)

    data = [skills, jd]
    
    tfidf = TfidfVectorizer()
    res = tfidf.fit_transform(data)
    tfidf_cos_score = cosine_similarity(res)[0][1]
    tfidf_euc_score = euclidean_distances(res)

    cv = CountVectorizer()
    count_matrix = cv.fit_transform(data)
    cv_cos_score = cosine_similarity(count_matrix)[0][1]
    cv_euc_score = euclidean_distances(count_matrix)

    spacy_sim = nlp(skills).similarity(nlp(jd))



    return tfidf_cos_score, cv_cos_score, tfidf_euc_score[0][1], cv_euc_score[0][1], spacy_sim


def get_similarity_spacy(skills, jd, nlp):
    for i in range(len(skills)):
        skills[i] = skills[i].lower()
    skills = ' '.join(i for i in skills)
    skills = nlp(skills)

    for i in range(len(jd)):
        jd[i] = jd[i].lower()
    jd = ' '.join(i for i in jd)
    jd = nlp(jd)
    return skills.similarity(jd)


if __name__ == '__main__':

    jd = []
    for root, directories, filenames in os.walk('jobdesc'):
        for filename in filenames:
            file = os.path.join(root, filename)
            jd.append(file)
    jd_data = [jd_result_wrapper(x) for x in jd]
    #pprint.pprint(jd_data)
    
    resumes = []
    for root, directories, filenames in os.walk('resumes'):
        for filename in filenames:
            file = os.path.join(root, filename)
            resumes.append(file)
    resume_data = [resume_result_wrapper(x) for x in resumes]
    #pprint.pprint(resume_data)
    
    
    c = 1
    nlp = spacy.load('en_core_web_md')
    for temp_resume in resume_data:
        print(f"NAME : {temp_resume['name']}: ")
        print(f"EDUCATION : {temp_resume['education']}")
        print(f"EMAIL : {temp_resume['email']}")
        print(f"EXPERIENCE : {temp_resume['experience']}")
        print(f"MOBILE NO : {temp_resume['mobile_number']}")
        print(f"SKILLS : {temp_resume['skills']}")
        print()
        skills = temp_resume['skills']
        tfidf_cos, cv_cos, tfidf_euc, cv_euc, spacy_score = get_similarity(skills, jd_data[0]['skills'], nlp)
        print(f"Similarity measure:  \n TF-IDF (COSINE) : {tfidf_cos} \n CV (COSINE) : {cv_cos} \n TFIDF (EUC) : {tfidf_euc} \n CV (EUC) : {cv_euc} \n SPACY: {spacy_score}")
        print()
        c += 1
