import re
from datasketch import MinHash, MinHashLSHForest
import numpy as np
import pandas as pd

def preprocess(text):
    text = re.sub(r'[^\w\s]','',text)
    tokens = text.lower()
    tokens = tokens.split()
    return tokens

def get_forest(data, perms=128):
    minhash = []
    for text in list(data['Skills'].values):
        tokens = preprocess(text)
        m = MinHash(num_perm=perms)
        for s in tokens:
            m.update(s.encode('utf8'))
        minhash.append(m)
    forest = MinHashLSHForest(num_perm=perms)
    for i, m in enumerate(minhash):
        forest.add(i, m)
    forest.index()
    
    return forest

def predict(text, database, perms, num_results, forest):
    tokens = preprocess(text)
    m = MinHash(num_perm=perms)
    for s in tokens:
        m.update(s.encode('utf8'))
    print(forest.query(m, num_results))
    idx_array = np.array(forest.query(m, num_results))
    if len(idx_array) == 0:
        return None
    result = database.iloc[idx_array][['Resume_Filenames']]
    return result