import os
import json
import redis
from pymongo import MongoClient
from bson.objectid import ObjectId

# --- CONNECTIONS ---
# We use environment variables so this translates perfectly to Docker and Kubernetes later
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/ai_task_platform')

print("🔌 Connecting to Redis...")
redis_client = redis.Redis.from_url(REDIS_URL)

print("🔌 Connecting to MongoDB...")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client['ai_task_platform']
tasks_collection = db['tasks']

# --- TASK LOGIC ---
def process_task(operation, text):
    """Handles the string manipulation logic required by the assignment."""
    if operation == 'uppercase':
        return text.upper()
    elif operation == 'lowercase':
        return text.lower()
    elif operation == 'reverse':
        return text[::-1]
    elif operation == 'word_count':
        return str(len(text.split()))
    else:
        raise ValueError(f"Unknown operation: {operation}")

# --- WORKER LOOP ---
def listen_queue():
    print(" Python Worker is online. Actively listening to 'task_queue'...")
    
    while True:
        try:
            # blpop (Block Left Pop) halts the script here until a job is pushed to the queue.
            # This is highly efficient—it uses zero CPU while waiting.
            result = redis_client.blpop('task_queue', timeout=0)
            
            if result:
                _, data = result
                job = json.loads(data.decode('utf-8'))
                
                task_id = job.get('taskId')
                operation = job.get('operation')
                input_text = job.get('inputText')

                print(f" Picked up Task {task_id} | Operation: {operation}")

                # 1. Update status to 'running'
                tasks_collection.update_one(
                    {'_id': ObjectId(task_id)},
                    {'$set': {'status': 'running'}}
                )

                # 2. Process the text
                output = process_task(operation, input_text)

                # 3. Update status to 'success' with results
                tasks_collection.update_one(
                    {'_id': ObjectId(task_id)},
                    {'$set': {
                        'status': 'success',
                        'result': output,
                        'logs': 'Task successfully executed by Python worker.'
                    }}
                )
                print(f"Task {task_id} processed successfully.")

        except Exception as e:
            error_msg = str(e)
            print(f"Error: {error_msg}")
            
            # 4. If anything crashes, mark as 'failed' and save the stack trace/error
            if 'task_id' in locals() and task_id:
                 tasks_collection.update_one(
                    {'_id': ObjectId(task_id)},
                    {'$set': {
                        'status': 'failed',
                        'logs': f"Worker crashed: {error_msg}"
                    }}
                )

if __name__ == "__main__":
    listen_queue()