from flask_frozen import Freezer
from app import app
import os
import shutil

freezer = Freezer(app)

@freezer.register_generator
def static_files():
    # 返回一个空列表而不是None
    return []

if __name__ == '__main__':
    # 生成静态文件
    if os.path.exists('build'):
        shutil.rmtree('build')
    os.makedirs('build/static', exist_ok=True)
    
    # 复制静态文件
    shutil.copytree('static', 'build/static', dirs_exist_ok=True)
    
    # 生成页面
    freezer.freeze() 